<?php

use Src\Utils\ControllerUtils;
use Src\Service\Budget\BudgetCreatorService;

final readonly class BudgetPostController {
    private BudgetCreatorService $service;

    public function __construct() {
        $this->service = new BudgetCreatorService();
    }

    public function start(): void
    {
        $idClient = ControllerUtils::getPost("idClient");
        $description = ControllerUtils::getPost("description");
        $total_amount = ControllerUtils::getPost("total_amount");
        // lines: optional array of {description, price}
        $lines = ControllerUtils::getPost("lines", false, []);

        $lastInsertedId = $this->service->create($idClient, $description, $total_amount, $lines);

        echo json_encode([
            "id" => $lastInsertedId
        ]);
    }
}