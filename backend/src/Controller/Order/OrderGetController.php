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
        $order = $this->service->find($id);

        echo json_encode([
            "id" => $order->id(),
            "idClient" => $order->idClient(),
            "idVehicle" => $order->idVehicle(),
            "idOrderTask" => $order->idOrderTask(),
        ], true);
    }
}
