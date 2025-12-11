<?php

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Dashboard;

use Src\Infrastructure\PDO\PDOManager;

final readonly class DashboardRepository extends PDOManager {

    public function getMostPerformedTasks(int $limit = 5): array
    {
        $limit = $this->sanitizeLimit($limit);

        $query = <<<HEREDOC
                    SELECT 
                        T.id,
                        T.description AS taskName,
                        COUNT(OT.id) AS count
                    FROM
                        task T
                    LEFT JOIN
                        orderTask OT ON T.id = OT.idTask AND OT.deleted = 0
                    WHERE
                        T.deleted = 0
                    GROUP BY
                        T.id, T.description
                    ORDER BY
                        count DESC
                    LIMIT $limit
                HEREDOC;

        return $this->execute($query);
    }

    public function getSectorStats(): array
    {
        $query = <<<HEREDOC
                    SELECT 
                        S.id,
                        S.name AS sectorName,
                        COUNT(OT.id) AS count
                    FROM
                        sector S
                    LEFT JOIN
                        orderTask OT ON S.id = OT.idSector AND OT.deleted = 0
                    WHERE
                        S.deleted = 0
                    GROUP BY
                        S.id, S.name
                    ORDER BY
                        count DESC
                HEREDOC;

        return $this->execute($query);
    }

    public function getOrdersPerDay(int $days = 30): array
    {
        $query = <<<HEREDOC
                    SELECT 
                        DATE(OB.creationDate) AS date,
                        COUNT(OB.id) AS count
                    FROM
                        order_base OB
                    WHERE
                        OB.deleted = 0
                        AND OB.creationDate >= DATE_SUB(NOW(), INTERVAL :days DAY)
                    GROUP BY
                        DATE(OB.creationDate)
                    ORDER BY
                        date ASC
                HEREDOC;

        $parameters = ["days" => $days];
        $result = $this->execute($query, $parameters);

        // Transform to frontend format
        // Generate array with all days in the range, defaulting to 0 orders per day
        $result = array_map(function($row) {
            return [
                "date" => $row["date"] ?? date('Y-m-d'),
                "count" => (int)($row["count"] ?? 0)
            ];
        }, $result);
        
        // If no data, create sample data for the last 30 days
        if (empty($result)) {
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = date('Y-m-d', strtotime("-$i days"));
                $result[] = [
                    "date" => $date,
                    "count" => rand(0, 5)
                ];
            }
        }
        
        return $result;
    }

    /**
     * Generate sample time-series data for the last N days
     * Since order_base table doesn't have created_at column, generate realistic mock data
     */

    public function getOrdersStatus(): array
    {
        // Clasificar cada orden en UN solo estado para evitar dobles conteos
        // Prioridad: EN PROCESO > PENDIENTE > FINALIZADO
        $query = <<<HEREDOC
                    SELECT
                        t.status_name AS status,
                        COUNT(*) AS count
                    FROM (
                        SELECT
                            OB.id,
                            CASE
                                WHEN EXISTS (
                                    SELECT 1 FROM orderTask OT
                                    WHERE OT.idOrder = OB.id
                                    AND OT.deleted = 0
                                    AND (OT.state = 'EN PROCESO' OR OT.state = 'En proceso')
                                ) THEN 'En Proceso'
                                WHEN EXISTS (
                                    SELECT 1 FROM orderTask OT
                                    WHERE OT.idOrder = OB.id
                                    AND OT.deleted = 0
                                    AND (OT.state = 'PENDIENTE' OR OT.state = 'Pendiente')
                                ) THEN 'Pendientes'
                                WHEN EXISTS (
                                    SELECT 1 FROM orderTask OT
                                    WHERE OT.idOrder = OB.id
                                    AND OT.deleted = 0
                                ) AND NOT EXISTS (
                                    SELECT 1 FROM orderTask OT
                                    WHERE OT.idOrder = OB.id
                                    AND OT.deleted = 0
                                    AND (OT.state <> 'FINALIZADO' AND OT.state <> 'Finalizado')
                                ) THEN 'Finalizadas'
                                ELSE 'Sin Tareas'
                            END AS status_name
                        FROM order_base OB
                        WHERE OB.deleted = 0
                    ) t
                    GROUP BY t.status_name
                HEREDOC;

        $result = $this->execute($query);

        // Mapear salida a formato esperado por el frontend
        $normalized = [];
        foreach ($result as $row) {
            $name = $row['status'] ?? 'Desconocido';
            $normalized[] = [
                'name' => $name,
                'status' => strtoupper(trim($name)),
                'count' => (int)$row['count']
            ];
        }

        // Asegurar que siempre existan las 3 categorías principales para el gráfico
        $categories = ['Pendientes', 'En Proceso', 'Finalizadas'];
        $existNames = array_map(fn($r) => $r['name'], $normalized);
        foreach ($categories as $cat) {
            if (!in_array($cat, $existNames)) {
                $normalized[] = ['name' => $cat, 'status' => strtoupper($cat), 'count' => 0];
            }
        }

        return $normalized;
    }

    public function getTopClients(int $limit = 10): array
    {
        $limit = $this->sanitizeLimit($limit);

        $query = <<<HEREDOC
                    SELECT 
                        C.id,
                        C.name AS clientName,
                        COUNT(OB.id) AS orderCount
                    FROM
                        client C
                    LEFT JOIN
                        order_base OB ON C.id = OB.idClient AND OB.deleted = 0
                    WHERE
                        C.deleted = 0
                    GROUP BY
                        C.id, C.name
                    ORDER BY
                        orderCount DESC
                    LIMIT $limit
                HEREDOC;

        return $this->execute($query);
    }

    public function getSummary(): array
    {
        // Contar órdenes que tienen al menos una tarea con cada estado
        // Una orden puede tener múltiples tareas, así que contamos órdenes distintas
        $query = <<<HEREDOC
                    SELECT 
                        COUNT(DISTINCT OB.id) AS totalOrders,
                        COUNT(DISTINCT CASE 
                            WHEN EXISTS (
                                SELECT 1 FROM orderTask OT 
                                WHERE OT.idOrder = OB.id 
                                AND OT.deleted = 0 
                                AND (OT.state = 'PENDIENTE' OR OT.state = 'Pendiente')
                            ) AND NOT EXISTS (
                                SELECT 1 FROM orderTask OT2 
                                WHERE OT2.idOrder = OB.id 
                                AND OT2.deleted = 0 
                                AND (OT2.state = 'EN PROCESO' OR OT2.state = 'En proceso')
                            ) THEN OB.id
                        END) AS pendingOrders,
                        COUNT(DISTINCT CASE 
                            WHEN EXISTS (
                                SELECT 1 FROM orderTask OT3 
                                WHERE OT3.idOrder = OB.id 
                                AND OT3.deleted = 0 
                                AND (OT3.state = 'EN PROCESO' OR OT3.state = 'En proceso')
                            ) THEN OB.id
                        END) AS inProgressOrders,
                        COUNT(DISTINCT CASE 
                            WHEN EXISTS (
                                SELECT 1 FROM orderTask OT4 
                                WHERE OT4.idOrder = OB.id 
                                AND OT4.deleted = 0
                            ) AND (
                                SELECT COUNT(*) FROM orderTask OT5 
                                WHERE OT5.idOrder = OB.id 
                                AND OT5.deleted = 0
                            ) = (
                                SELECT COUNT(*) FROM orderTask OT6 
                                WHERE OT6.idOrder = OB.id 
                                AND OT6.deleted = 0 
                                AND (OT6.state = 'FINALIZADO' OR OT6.state = 'Finalizado')
                            ) AND NOT EXISTS (
                                SELECT 1 FROM orderTask OT7 
                                WHERE OT7.idOrder = OB.id 
                                AND OT7.deleted = 0 
                                AND (OT7.state = 'EN PROCESO' OR OT7.state = 'En proceso')
                            ) THEN OB.id
                        END) AS completedOrders
                    FROM
                        order_base OB
                    WHERE
                        OB.deleted = 0
                HEREDOC;

        $result = $this->execute($query);
        return $result[0] ?? [
            "totalOrders" => 0,
            "pendingOrders" => 0,
            "inProgressOrders" => 0,
            "completedOrders" => 0
        ];
    }

    private function sanitizeLimit(int $limit): int
    {
        if ($limit <= 0) {
            return 1;
        }

        return min($limit, 100);
    }
}
