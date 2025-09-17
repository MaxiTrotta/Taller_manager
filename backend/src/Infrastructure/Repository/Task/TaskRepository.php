<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Task;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Task\Task;

final readonly class TaskRepository extends PDOManager implements TaskRepositoryInterface {

    public function find(int $id): ?Task 
    {
        $query = "SELECT * FROM task WHERE id = :id AND deleted = 0";

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToTask($result[0] ?? null);
    }

    public function search(): array
    {
        $query = "SELECT * FROM task WHERE deleted = 0";
        $results = $this->execute($query);

        $taskResults = [];
        foreach ($results as $result) {
            $taskResults[] = $this->primitiveToTask($result);
        }

        return $taskResults;
    }

    public function insert(Task $task): void
    {
        $query = "INSERT INTO task (name, deleted) VALUES (:name, :deleted) ";

        $parameters = [
            "name" => $task->name(),
            "deleted" => $task->isDeleted()
        ];

        $this->execute($query, $parameters);
    }

    public function update(Task $task): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            task
                        SET
                            name = :name,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "name" => $task->name(),
            "deleted" => $task->isDeleted(),
            "id" => $task->id()
        ];

        $this->execute($query, $parameters);
    }

    private function primitiveToTask(?array $primitive): ?Task
    {
        if ($primitive === null) {
            return null;
        }

        return new Task(
            $primitive["id"],
            $primitive["name"],
            $primitive["deleted"]
        );
    }
}