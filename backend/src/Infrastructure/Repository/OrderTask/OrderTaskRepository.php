<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\OrderTask;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\OrderTask\OrderTask;
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

    // public function search(): array
    // {
    //     $query = "SELECT OT.* ";
    //     $query .= "FROM orderTask OT WHERE deleted = 0";
    //     $results = $this->execute($query);

    //     $orderTaskResults = [];
    //     foreach ($results as $result) {
    //         $orderTaskResults[] = $this->primitiveToOrderTaskInformation($result);
    //     }

    //     return $orderTaskResults;
    // }


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

    // private function primitiveToOrderTaskInformation(?array $primitive): ?OrderTaskInformation
    // {
    //     if ($primitive === null) {
    //         return null;
    //     }

    //     return new OrderTaskInformation(
    //         $primitive["idOrder"],
    //         $primitive["sectorName"],
    //         $primitive["loquequiers"],
    //     );
    // }
}