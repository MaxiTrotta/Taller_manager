<?php 

use Src\Service\Budget\BudgetDeleterService;

final readonly class BudgetDeleteController {
    private BudgetDeleterService $service;

    public function __construct() {
        $this->service = new BudgetDeleterService();
    }

    public function start(int $id): void
    {
        $this->service->delete($id);
    }
}