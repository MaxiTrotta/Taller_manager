<?php 

namespace Src\Service\Task;

use Src\Entity\Task\Task;
use Src\Infrastructure\Repository\Task\TaskRepository;

final readonly class TaskCreatorService {
    private TaskRepository $repository;

    public function __construct() {
        $this->repository = new TaskRepository();
    }

    public function create(string $description): void
    {
        $task = Task::create($description);
        $this->repository->insert($task);
    }
}