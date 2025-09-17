<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Task;

use Src\Entity\Task\Task;

interface TaskRepositoryInterface {
    public function find(int $id): ?Task;

    /** @return Task[] */
    public function search(): array;

    public function insert(Task $task): void;

    public function update(Task $task): void;
}