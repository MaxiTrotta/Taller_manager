<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Order\OrderFinderService;

final readonly class OrderGetController extends AuthMiddleware {
    private OrderFinderService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new OrderFinderService();
    }

    public function start(int $id): void 
    {
        $order = $this->service->findProjection($id);

        // echo json_encode([
        //     "id" => $order->id(),
        //     "client" => $order->client(),
        //     "vehicle" => $order->vehicle(),
        //     "orderTaskProjection" => $order->orderTaskProjection(),
        // ], true);

        $tasks = [];

        foreach ($order->orderTaskProjection() as $task) {
            $tasks[] = [
                "id" => $task->id(),
                "idOrder" => $task->idOrder(),
                "state" => $task->state(),
                "sectorName" => $task->sectorName(),
                "taskDescription" => $task->taskDescription(),
                "note" => $task->note(),
            ];
        }

        echo json_encode([
            "id" => $order->id(),
            "client" => $order->client(),
            "vehicle" => $order->vehicle(),
            "vehicleBrand" => method_exists($order, 'vehicleBrand') ? $order->vehicleBrand() : null,
            "vehicleModel" => method_exists($order, 'vehicleModel') ? $order->vehicleModel() : null,
            "creationDate" => $order->creationDate(),
            "createdBy" => method_exists($order, 'createdBy') ? $order->createdBy() : null,
            "modifiedBy" => method_exists($order, 'modifiedBy') ? $order->modifiedBy() : null,
            "modifiedAt" => method_exists($order, 'modifiedAt') ? $order->modifiedAt() : null,
            "state" => $order->getOrderTaskState(),
            "tasks" => $tasks,
        ], JSON_PRETTY_PRINT);
    }
}
