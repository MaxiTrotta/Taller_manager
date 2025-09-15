<?php

use Src\Utils\ControllerUtils;
use Src\Service\Order\OrderCreatorService;

final readonly class OrderPostController {
    private OrderCreatorService $service;

    public function __construct() {
        $this->service = new OrderCreatorService();
    }

    public function start(): void
    {
        $name = ControllerUtils::getPost("name");
        $idClient = ControllerUtils::getPost("idClient");

        $this->service->create($name, $idClient);
    }
}