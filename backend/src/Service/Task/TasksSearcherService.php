<?php 

namespace Src\Service\Task;

use Src\Infrastructure\Repository\Task\TaskRepository;

final readonly class TasksSearcherService {

    private TaskRepository $repository;

    public function __construct() {
        $this->repository = new TaskRepository();
    }

    public function search(): array
    {
        return $this->repository->search();
    }
}