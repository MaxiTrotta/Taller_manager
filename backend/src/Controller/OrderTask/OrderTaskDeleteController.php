<?php 

use Src\Service\OrderTask\OrderTaskDeleterService;

final readonly class OrderTaskDeleteController {
    private OrderTaskDeleterService $service;

    public function __construct() {
        $this->service = new OrderTaskDeleterService();
    }

    public function start(int $id): void
    {
        $this->service->delete($id);
    }
}