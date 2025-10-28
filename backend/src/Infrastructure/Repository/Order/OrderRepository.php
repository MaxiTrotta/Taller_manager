<?php

declare(strict_types=1);

namespace Src\Infrastructure\Repository\Order;

use DateTime;
use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Order\Order;
use Src\Entity\Order\OrderProjection;
use Src\Entity\OrderTask\OrderTaskProjection;

final readonly class OrderRepository extends PDOManager implements OrderRepositoryInterface
{

    public function find(int $id): ?Order
    {
        $query = <<<HEREDOC
                        SELECT *
                        FROM order_base O
                        WHERE O.id = :id AND O.deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);

        return $this->primitiveToOrder($result[0] ?? null);
    }
    public function findProjection(int $id): ?OrderProjection
    {
        $query = <<<HEREDOC
            SELECT 
                o.id AS idOrder,
                c.name AS clientName,
                v.licensePlate AS vehiclePlate,
                o.creationDate AS creationDate
            FROM order_base o
            INNER JOIN client c ON (c.id = o.idClient AND c.deleted = 0)
            INNER JOIN vehicle v ON (v.id = o.idVehicle AND v.deleted = 0)
            WHERE
                o.deleted = 0 
                AND o.id = :id
            ORDER BY 
                o.creationDate DESC
        HEREDOC;

        $parameters = ["id" => $id];
        $result = $this->execute($query, $parameters);

        return $this->primitiveToOrderProjection($result[0] ?? null);
    }



    // public function findProjection(int $id): ?OrderProjection
    // {
    //     $query = <<<HEREDOC
    //                     SELECT O.*,
    //                            C.name AS client,
    //                            V.licensePlate AS vehicle,
    //                            O.idOrderTask
    //                     FROM order_base O
    //                     INNER JOIN client C ON O.idClient = C.id
    //                     INNER JOIN vehicle V ON O.idVehicle = V.id
    //                     WHERE O.id = :id AND O.deleted = 0
    //                 HEREDOC;

    //     $parameters = [
    //         "id" => $id
    //     ];

    //     $result = $this->execute($query, $parameters);

    //     return $this->primitiveToOrderProjection($result[0] ?? null);
    // }

    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT 
                            O.*
                        FROM
                            order_base O
                        WHERE
                            O.deleted = 0
                    HEREDOC;
        $results = $this->execute($query);

        $orderResults = [];
        foreach ($results as $result) {
            $orderResults[] = $this->primitiveToOrder($result);
        }

        return $orderResults;
    }
    public function searchProjections(): array
    {
        $query = <<<HEREDOC
            SELECT 
                o.id AS idOrder,
                c.name AS clientName,
                v.licensePlate AS vehiclePlate,
                o.creationDate AS creationDate
            FROM order_base o
            INNER JOIN client c ON (c.id = o.idClient AND c.deleted = 0)
            INNER JOIN vehicle v ON (v.id = o.idVehicle AND v.deleted = 0)
            WHERE 
                o.deleted = 0 
            ORDER BY 
                o.creationDate DESC

        HEREDOC;

        $results = $this->execute($query);

        $orderProjectionResults = [];
        foreach ($results as $result) {
            $orderProjectionResults[] = $this->primitiveToOrderProjection($result);
        }

        return $orderProjectionResults;
    }


    public function insert(Order $order): int
    {
        $query = <<<INSERT_QUERY
                    INSERT INTO order_base (idClient, idVehicle, idOrderTask, creationDate, deleted) VALUES (:idClient, :idVehicle, :idOrderTask, :creationDate, :deleted)
                INSERT_QUERY;

        $parameters = [
            "idClient" => $order->idClient(),
            "idVehicle" => $order->idVehicle(),
            "idOrderTask" => $order->idOrderTask(),
            "creationDate" => $order->creationDate(),
            "deleted" => $order->isDeleted()
        ];

        $this->execute($query, $parameters);

        return $this->getLastInsertId();
    }

    public function update(Order $order): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            order_base
                        SET
                            idClient = :idClient,
                            idVehicle = :idVehicle,
                            idOrderTask = :idOrderTask,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "idClient" => $order->idClient(),
            "idVehicle" => $order->idVehicle(),
            "idOrderTask" => $order->idOrderTask(),
            "deleted" => $order->isDeleted(),
            "id" => $order->id()
        ];

        $this->execute($query, $parameters);
    }

    // private function primitiveToOrder(?array $primitive): ?Order
    // {
    //     if ($primitive === null) {
    //         return null;
    //     }

    //     return new Order(
    //         (int) $primitive["id"],
    //         (int) $primitive["idClient"],
    //         (int) $primitive["idVehicle"],
    //         (int) $primitive["idOrderTask"],
    //         isset($primitive["creationDate"]) ? new DateTime($primitive["creationDate"]) : null,
    //         (bool) $primitive["deleted"]
    //     );
    // }

    private function primitiveToOrder(?array $primitive): ?Order
    {
        if ($primitive === null) {
            return null;
        }

        // Crear un objeto DateTime solo si la fecha existe y no es nula
        $creationDate = null;
        if (!empty($primitive["creationDate"])) {
            // Le indicamos explícitamente la zona horaria de Argentina
            $creationDate = new DateTime(
                $primitive["creationDate"],
                new \DateTimeZone('America/Argentina/Buenos_Aires')
            );
        }

        return new Order(
            (int) $primitive["id"],
            (int) $primitive["idClient"],
            (int) $primitive["idVehicle"],
            (int) $primitive["idOrderTask"],
            $creationDate,
            (bool) $primitive["deleted"]
        );
    }

    // private function primitiveToOrderProjection(?array $primitive): ?OrderProjection
    // {
    //     if ($primitive === null) {
    //         return null;
    //     }

    //     return new OrderProjection(
    //         (int) $primitive["idOrder"],
    //         (string) $primitive["clientName"],
    //         (string) $primitive["vehiclePlate"],
    //         (string) $primitive["creationDate"],
    //     );
    // }

    private function primitiveToOrderProjection(?array $primitive): ?OrderProjection
    {
        if ($primitive === null) {
            return null;
        }

        // obtener la fecha raw (ajustá el índice al que usás en tu SELECT)
        $rawDate = $primitive['creationDate'] ?? $primitive['creationDate'] ?? null;

        $formattedDate = null;
        if (!empty($rawDate)) {
            $dt = new \DateTime($rawDate, new \DateTimeZone('America/Argentina/Buenos_Aires'));
            $formattedDate = $dt->format('Y-m-d H:i:s'); // ej: 2025-10-22T16:25:00-03:00
        }

        return new OrderProjection(
            (int) $primitive["idOrder"],
            (string) $primitive["clientName"],
            (string) $primitive["vehiclePlate"],
            $formattedDate // string ISO 8601 o null
        );
    }



}