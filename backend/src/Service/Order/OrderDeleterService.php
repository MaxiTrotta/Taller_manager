<?php 

namespace Src\Service\Order;

use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrderDeleterService {
    private OrderRepository $repository;
    private OrderFinderService $finder;

    public function __construct() {
        $this->repository = new OrderRepository();
        $this->finder = new OrderFinderService();
    }

    public function delete(int $id): void
    {
        $order = $this->finder->find($id);

        $order->delete();

        $this->repository->update($order);
    }
}