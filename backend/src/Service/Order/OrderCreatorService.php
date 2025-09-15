<?php 

namespace Src\Service\Order;

use Src\Entity\Order\Order;
use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrderCreatorService {
    private OrderRepository $repository;

    public function __construct() {
        $this->repository = new OrderRepository();
    }

    public function create(string $name, int $idClient): void
    {
        $order = Order::create($name, $idClient);
        $this->repository->insert($order);
    }
}