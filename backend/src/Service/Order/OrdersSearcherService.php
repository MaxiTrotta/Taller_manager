<?php 

namespace Src\Service\Order;

use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrdersSearcherService {

    private OrderRepository $repository;

    public function __construct() {
        $this->repository = new OrderRepository();
    }

    public function search(): array
    {
        return $this->repository->search();
    }
}