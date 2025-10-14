<?php 

namespace Src\Service\OrderTask;

use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;

final readonly class OrderTasksSearcherService {

    private OrderTaskRepository $repository;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
    }

    public function searchProjections(?int $orderId = null): array
    {
        if (!empty($orderId)) {  
            return $this->repository->searchProjectionsByOrder($orderId);  
        }

        return $this->repository->searchProjections();
    }
}