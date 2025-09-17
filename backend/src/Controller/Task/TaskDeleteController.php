<?php 

use Src\Service\Task\TaskDeleterService;

final readonly class TaskDeleteController {
    private TaskDeleterService $service;

    public function __construct() {
        $this->service = new TaskDeleterService();
    }

    public function start(int $id): void
    {
        $this->service->delete($id);
    }
}