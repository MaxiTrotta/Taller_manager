Task<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\OrderTask\OrderTaskFinderService;

final readonly class OrderTaskGetController extends AuthMiddleware {
    private OrderTaskFinderService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new OrderTaskFinderService();
    }

    public function start(int $id): void 
    {
        $orderTask = $this->service->find($id);

        echo json_encode([
            "id" => $orderTask->id(),
            "date" => $orderTask->date(),
            "state" => $orderTask->state(),
            "createdBy" => $orderTask->createdBy(),
            "assignedTo" => $orderTask->assignedTo(),
            "idSector" => $orderTask->idSector(),
            "idTask" => $orderTask->idTask(),
        ], true);
    }
}
