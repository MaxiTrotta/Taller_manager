<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\OrderTask;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\OrderTask\OrderTask;
use Src\Entity\OrderTask\OrderTaskProjection;
//use Src\Entity\OrderTask\OrderTaskInformation;
use DateTime;

final readonly class OrderTaskRepository extends PDOManager implements OrderTaskRepositoryInterface {

    public function find(int $id): ?OrderTask 
    {
        $query = <<<HEREDOC
                        SELECT 
                            *
                        FROM
                            orderTask OT
                        WHERE
                            OT.id = :id AND OT.deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToOrderTask($result[0] ?? null);
    }

    public function findProjection(int $id): ?OrderTaskProjection
    {
        $query = <<<HEREDOC
                        SELECT 
                            OT.*,
                            S.name AS sectorName,
                            T.description AS taskDescription
                        FROM
                            orderTask OT
                        INNER JOIN
                            sector S ON OT.idSector = S.id
                        INNER JOIN
                            task T ON OT.idTask = T.id
                        WHERE
                            OT.id = :id AND OT.deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToOrderTaskProjection($result[0] ?? null);
    }


    /** @return OrderTask[] */
    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT
                            *
                        FROM
                            orderTask
                        WHERE
                            deleted = 0
                    HEREDOC;
        
        $results = $this->execute($query);

        $orderTaskResults = [];
        foreach($results as $result) {
            $orderTaskResults[] = $this->primitiveToOrderTask($result);
        }

        return $orderTaskResults;
    }


    /** @return OrderTaskProjection[] */
    public function searchProjections(): array
    {
        $query = <<<HEREDOC
                        SELECT
                            OT.*,
                            S.name AS sectorName,
                            T.description AS taskDescription
                        FROM
                            orderTask OT
                        INNER JOIN
                            sector S ON OT.idSector = S.id
                        INNER JOIN
                            task T ON OT.idTask = T.id
                        WHERE
                            OT.deleted = 0
                    HEREDOC;
        
        $results = $this->execute($query);

        $orderTaskResults = [];
        foreach($results as $result) {
            $orderTaskResults[] = $this->primitiveToOrderTaskProjection($result);
        }

        return $orderTaskResults;
    }

    /** @return OrderTaskProjection[] */
    public function searchProjectionsByOrder(int $orderId): array
    {
        $query = <<<HEREDOC
                        SELECT
                            OT.*,
                            S.name AS sectorName,
                            T.description AS taskDescription
                        FROM
                            orderTask OT
                        INNER JOIN
                            sector S ON OT.idSector = S.id
                        INNER JOIN
                            task T ON OT.idTask = T.id
                        WHERE
                            OT.deleted = 0 AND OT.idOrder = :orderId
                    HEREDOC;
        
        $parameters = [
            "orderId" => $orderId
        ];

        $results = $this->execute($query, $parameters);

        $orderTaskResults = [];
        foreach($results as $result) {
            $orderTaskResults[] = $this->primitiveToOrderTaskProjection($result);
        }

        return $orderTaskResults;
    }
    public function insert(OrderTask $orderTask): void
    {
        $query = <<<INSERT_QUERY
                    INSERT INTO orderTask (idOrder, state, idSector, idTask, deleted) VALUES (:idOrder, :state, :idSector, :idTask, :deleted)
                INSERT_QUERY;

        $parameters = [
            "idOrder" => $orderTask->idOrder(),
            // "date" => $orderTask->date(),
            "state" => $orderTask->state(),
            // "createdBy" => $orderTask->createdBy(),
            // "assignedTo" => $orderTask->assignedTo(),
            "idSector" => $orderTask->idSector(),
            "idTask" => $orderTask->idTask(),
            "deleted" => $orderTask->isDeleted()
        ];

        $this->execute($query, $parameters);
    }

    public function update(OrderTask $orderTask): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            orderTask
                        SET
                            idOrder = :idOrder,
                            state = :state,
                            idSector = :idSector,
                            idTask = :idTask,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "idOrder" => $orderTask->idOrder(),
            // "date" => $orderTask->date(),
            "state" => $orderTask->state(),
            // "createdBy" => $orderTask->createdBy(),
            // "assignedTo" => $orderTask->assignedTo(),
            "idSector" => $orderTask->idSector(),
            "idTask" => $orderTask->idTask(),
            "deleted" => $orderTask->isDeleted(),
            "id" => $orderTask->id()
        ];

        $this->execute($query, $parameters);
    }

    private function primitiveToOrderTask(?array $primitive): ?OrderTask
    {
        if ($primitive === null) {
            return null;
        }

        return new OrderTask(
            (int)$primitive["id"],
            (int)$primitive["idOrder"],
            //new DateTime($primitive["date"]),
            (string)$primitive["state"] ?? null,
           // $primitive["createdBy"],
           // $primitive["assignedTo"],
            (int)$primitive["idSector"],
            (int)$primitive["idTask"],
            (bool)$primitive["deleted"]
        );
    }
    private function primitiveToOrderTaskProjection(?array $primitive): ?OrderTaskProjection
    {
        if ($primitive === null) {
            return null;
        }

        return new OrderTaskProjection(
            (int)$primitive["idOrder"],
            (string)$primitive["state"] ?? null,
            (string)$primitive["sectorName"] ?? null,
            (string)$primitive["taskDescription"] ?? null
        );
    }
}