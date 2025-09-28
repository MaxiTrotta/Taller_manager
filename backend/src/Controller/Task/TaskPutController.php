<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Task\TaskUpdaterService;

final readonly class TaskPutController {
    private TaskUpdaterService $service;

    public function __construct() {
        $this->service = new TaskUpdaterService();
    }

    public function start(int $id): void
    {
        $description = ControllerUtils::getPost("description");

        $this->service->update($description, $id);
    }
}