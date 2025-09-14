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
        $name = ControllerUtils::getPost("name");
        $idClient = ControllerUtils::getPost("idClient");

        $this->service->update($name, $idClient, $id);
    }
}