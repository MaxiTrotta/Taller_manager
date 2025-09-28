<?php

use Src\Utils\ControllerUtils;
use Src\Service\Task\TaskCreatorService;

final readonly class TaskPostController {
    private TaskCreatorService $service;

    public function __construct() {
        $this->service = new TaskCreatorService();
    }

    public function start(): void
    {
        $description = ControllerUtils::getPost("description");

        $this->service->create($description);
    }
}