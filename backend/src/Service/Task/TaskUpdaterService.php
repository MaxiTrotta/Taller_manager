<?php 

namespace Src\Service\Task;

use Src\Infrastructure\Repository\Task\TaskRepository;

final readonly class TaskUpdaterService {
    private TaskRepository $repository;
    private TaskFinderService $finder;

    public function __construct() {
        $this->repository = new TaskRepository();
        $this->finder = new TaskFinderService();
    }

    public function update(string $description, int $id): void
    {
        $task = $this->finder->find($id);

        $task->modify($description);

        $this->repository->update($task);
    }
}