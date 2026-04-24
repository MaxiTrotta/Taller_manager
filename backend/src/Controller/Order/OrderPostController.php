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
        $idClient = ControllerUtils::getPost("idClient");
        $idVehicle = ControllerUtils::getPost("idVehicle");

        $idOrderTask = ControllerUtils::getPost("idOrderTask");
        // optional audit field sent from frontend (username)
        $createdBy = ControllerUtils::getPost("createdBy", false, null);

        $lastInsertedId = $this->service->create($idClient, $idVehicle, $idOrderTask, $createdBy);

        echo json_encode([
            "id" => $lastInsertedId
        ]);
    }
}
