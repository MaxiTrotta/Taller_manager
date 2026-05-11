<?php 

namespace Src\Service\OrderTask;

use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;

final readonly class OrderTaskDeleterService {
    private OrderTaskRepository $repository;
    private OrderTaskFinderService $finder;
    private \Src\Infrastructure\Repository\Order\OrderRepository $orderRepository;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
        $this->finder = new OrderTaskFinderService();
        $this->orderRepository = new \Src\Infrastructure\Repository\Order\OrderRepository();
    }

    public function delete(int $id): void
    {
        $orderTask = $this->finder->find($id);

        $orderTask->delete();

        $this->repository->update($orderTask);

        // touch parent order modification timestamp
        if ($orderTask && $orderTask->idOrder()) {
            $this->orderRepository->touchModified($orderTask->idOrder(), null);
        }
    }
}