<?php 

namespace Src\Service\Order;

use Src\Infrastructure\Repository\Order\OrderRepository;
use Src\Service\OrderTask\OrderTasksSearcherService;

final readonly class OrdersSearcherService {

    private OrderRepository $repository;
    private OrderTasksSearcherService $orderTasksSearcherService;

    public function __construct() {
        $this->repository = new OrderRepository();
        $this->orderTasksSearcherService = new OrderTasksSearcherService();
    }

    public function searchProjections(): array
    {
        $orders = $this->repository->searchProjections();
        $orderTasks = $this->searchOrderTasks();    

        foreach ($orders as $order) {
            $order->setOrderTaskProjection($orderTasks[$order->id()] ?? []);
        }

        return $orders;
    }

    private function searchOrderTasks(): array
    {
        $output = [];
        $orderTasks = $this->orderTasksSearcherService->searchProjections();

        foreach ($orderTasks as $task) {
            $output[$task->idOrder()][] = $task;
        }

        return $output;
    }
}