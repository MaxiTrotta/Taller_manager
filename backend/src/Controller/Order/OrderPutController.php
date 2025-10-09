<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Order\OrderUpdaterService;

final readonly class OrderPutController {
    private OrderUpdaterService $service;

    public function __construct() {
        $this->service = new OrderUpdaterService();
    }

    public function start(int $id): void
    {
        $idClient = ControllerUtils::getPost("idClient");
        $idVehicle = ControllerUtils::getPost("idVehicle");
        $idOrderTask = ControllerUtils::getPost("idOrderTask");

        $this->service->update( $idClient, $idVehicle, $idOrderTask, $id);
    }
}