<?php 


declare(strict_types = 1);

namespace Src\Service\Order;

use Src\Entity\Order\Order;
use Src\Entity\Order\OrderProjection;
use Src\Entity\Order\Exception\OrderNotFoundException;
use Src\Infrastructure\Repository\Order\OrderRepository;
use Src\Service\OrderTask\OrderTasksSearcherService;

final readonly class OrderFinderService {

    private OrderRepository $orderRepository;
    private OrderTasksSearcherService $orderTasksSearcherService;

    public function __construct() 
    {
        $this->orderRepository = new OrderRepository();
        $this->orderTasksSearcherService = new OrderTasksSearcherService();
    }

    public function find(int $id): Order 
    {
        $order = $this->orderRepository->find($id);

        if ($order === null) {
            throw new OrderNotFoundException($id);
        }

        return $order;
    }
    public function findProjection(int $id): OrderProjection 
    {
        $orderProjection = $this->orderRepository->findProjection($id);

        if ($orderProjection === null) {
            throw new OrderNotFoundException($id);
        }

        $tasks = $this->orderTasksSearcherService->searchProjections($id);

        $orderProjection->setOrderTaskProjection($tasks);

        return $orderProjection;
    }

}
