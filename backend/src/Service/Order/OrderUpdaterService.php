<?php 

namespace Src\Service\Order;

use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrderUpdaterService {
    private OrderRepository $repository;
    private OrderFinderService $finder;

    public function __construct() {
        $this->repository = new OrderRepository();
        $this->finder = new OrderFinderService();
    }

    public function update(string $name, string $idClient, int $id): void
    {
        $order = $this->finder->find($id);

        $order->modify($name, $idClient);

        $this->repository->update($order);
    }
}