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
        $name = ControllerUtils::getPost("name");

        $this->service->create($name);
    }
}