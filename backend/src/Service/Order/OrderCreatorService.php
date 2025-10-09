<?php 

namespace Src\Service\Order;

use Src\Entity\Order\Order;
use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrderCreatorService {
    private OrderRepository $repository;

    public function __construct() {
        $this->repository = new OrderRepository();
    }

    public function create(int $idClient, int $idVehicle, int $idOrderTask): void
    {
        $order = Order::create($idClient, $idVehicle, $idOrderTask);
        $this->repository->insert($order);
    }
}