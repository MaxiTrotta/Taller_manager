<?php 

use Src\Service\Order\OrderDeleterService;

final readonly class OrderDeleteController {
    private OrderDeleterService $service;

    public function __construct() {
        $this->service = new OrderDeleterService();
    }

    public function start(int $id): void
    {
        $this->service->delete($id);
    }
}