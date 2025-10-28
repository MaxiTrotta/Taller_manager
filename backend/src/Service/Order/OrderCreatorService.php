<?php 

namespace Src\Service\Order;

use Src\Entity\Order\Order;
use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrderCreatorService {
    private OrderRepository $repository;

    public function __construct() {
        $this->repository = new OrderRepository();
    }

    public function create(int $idClient, int $idVehicle, int $idOrderTask): int
    {
        $order = Order::create($idClient, $idVehicle, $idOrderTask);
        $lastInsertedId = $this->repository->insert($order);

        return $lastInsertedId;
    }
}