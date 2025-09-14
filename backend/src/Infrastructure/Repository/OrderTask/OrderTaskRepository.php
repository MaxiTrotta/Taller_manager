<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\OrderTask;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\OrderTask\OrderTask;
use DateTime;

final readonly class OrderTaskRepository extends PDOManager implements OrderTaskRepositoryInterface {

    public function find(int $id): ?OrderTask 
    {
        $query = "SELECT * FROM order_task WHERE id = :id AND deleted = 0";

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToOrderTask($result[0] ?? null);
    }

    public function search(): array
    {
        $query = "SELECT * FROM order_task WHERE deleted = 0";
        $results = $this->execute($query);

        $orderTaskResults = [];
        foreach ($results as $result) {
            $orderTaskResults[] = $this->primitiveToOrderTask($result);
        }

        return $orderTaskResults;
    }

    public function insert(OrderTask $orderTask): void
    {
        $query = <<<INSERT_QUERY
                    INSERT INTO order_task (idOrder, date, state, createdBy, assignedTo, idSector, idTask, deleted) VALUES (:idOrder, :date, :state, :createdBy, :assignedTo, :idSector, :idTask, :deleted)
                INSERT_QUERY;

        $parameters = [
            "idOrder" => $orderTask->idOrder(),
            "date" => $orderTask->date(),
            "state" => $orderTask->state(),
            "createdBy" => $orderTask->createdBy(),
            "assignedTo" => $orderTask->assignedTo(),
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
                            order_task
                        SET
                            idOrder = :idOrder,
                            date = :date,
                            state = :state,
                            createdBy = :createdBy,
                            assignedTo = :assignedTo,
                            idSector = :idSector,
                            idTask = :idTask,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "idOrder" => $orderTask->idOrder(),
            "date" => $orderTask->date(),
            "state" => $orderTask->state(),
            "createdBy" => $orderTask->createdBy(),
            "assignedTo" => $orderTask->assignedTo(),
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
            $primitive["id"],
            $primitive["idOrder"],
            new DateTime($primitive["date"]),
            $primitive["state"],
            $primitive["createdBy"],
            $primitive["assignedTo"],
            $primitive["idSector"],
            $primitive["idTask"],
            $primitive["deleted"]
        );
    }
}