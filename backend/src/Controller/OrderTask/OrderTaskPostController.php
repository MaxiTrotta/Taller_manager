<?php

use Src\Utils\ControllerUtils;
use Src\Service\OrderTask\OrderTaskCreatorService;

final readonly class OrderTaskPostController {
    private OrderTaskCreatorService $service;

    public function __construct() {
        $this->service = new OrderTaskCreatorService();
    }

    public function start(): void
    {
        $idOrder = ControllerUtils::getPost("idOrder");
        $date = ControllerUtils::getPost("date");
        $state = ControllerUtils::getPost("state");
        $createdBy = ControllerUtils::getPost("createdBy");
        $assignedTo = ControllerUtils::getPost("assignedTo");
        $idSector = ControllerUtils::getPost("idSector");
        $idTask = ControllerUtils::getPost("idTask");

        $this->service->create(
            $idOrder,
            $date,
            $state,
            $createdBy,
            $assignedTo,
            $idSector,
            $idTask
        );
    }
}