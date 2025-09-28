<?php 

use Src\Utils\ControllerUtils;
use Src\Service\OrderTask\OrderTaskUpdaterService;

final readonly class OrderTaskPutController {
    private OrderTaskUpdaterService $service;

    public function __construct() {
        $this->service = new OrderTaskUpdaterService();
    }

    public function start(int $id): void
    {
        $idOrder = ControllerUtils::getPost("idOrder");
        //$date = ControllerUtils::getPost("date");
        $state = ControllerUtils::getPost("state");
       // $createdBy = ControllerUtils::getPost("createdBy");
       // $assignedTo = ControllerUtils::getPost("assignedTo");

        $this->service->update(
            $idOrder,
            //$date,
            $state,
            //$createdBy,
            //$assignedTo,
            $id
        );
    }
}