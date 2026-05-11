<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Budget\BudgetUpdaterService;

final readonly class BudgetPutController {
    private BudgetUpdaterService $service;

    public function __construct() {
        $this->service = new BudgetUpdaterService();
    }

    public function start(int $id): void
    {
        $idClient = ControllerUtils::getPost("idClient");
        $description = ControllerUtils::getPost("description");
        $total_amount = ControllerUtils::getPost("total_amount");
        // optional structured lines array: [{description, price}, ...]
        $lines = ControllerUtils::getPost("lines", false, []);

        $this->service->update( $idClient, $description, $total_amount, $id, $lines);
    }
}