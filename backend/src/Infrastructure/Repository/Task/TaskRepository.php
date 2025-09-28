<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Task;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Task\Task;

final readonly class TaskRepository extends PDOManager implements TaskRepositoryInterface {

    public function find(int $id): ?Task 
    {
        $query = <<<HEREDOC
                        SELECT * 
                        FROM task 
                        WHERE id = :id AND deleted = 0
                    HEREDOC;

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
        $query = "INSERT INTO task (description, deleted) VALUES (:description, :deleted) ";

        $parameters = [
            "description" => $task->description(),
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
                            description = :description,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "description" => $task->description(),
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
            (int)$primitive["id"],
            (string)$primitive["description"],
            (bool)$primitive["deleted"]
        );
    }
}