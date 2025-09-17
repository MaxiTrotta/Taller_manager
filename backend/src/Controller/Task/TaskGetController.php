<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Task\TaskFinderService;

final readonly class TaskGetController extends AuthMiddleware {
    private TaskFinderService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new TaskFinderService();
    }

    public function start(int $id): void 
    {
        $task = $this->service->find($id);

        echo json_encode([
            "id" => $task->id(),
            "name" => $task->name(),
        ], true);
    }
}
