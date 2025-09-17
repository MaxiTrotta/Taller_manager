<?php 

namespace Src\Service\Task;

use Src\Infrastructure\Repository\Task\TaskRepository;

final readonly class TaskDeleterService {
    private TaskRepository $repository;
    private TaskFinderService $finder;

    public function __construct() {
        $this->repository = new TaskRepository();
        $this->finder = new TaskFinderService();
    }

    public function delete(int $id): void
    {
        $task = $this->finder->find($id);

        $task->delete();

        $this->repository->update($task);
    }
}