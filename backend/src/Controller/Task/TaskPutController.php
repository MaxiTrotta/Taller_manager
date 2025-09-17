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
        $name = ControllerUtils::getPost("name");

        $this->service->update($name, $id);
    }
}