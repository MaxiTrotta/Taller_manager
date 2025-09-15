<?php 

namespace Src\Service\OrderTask;

use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;

final readonly class OrderTasksSearcherService {

    private OrderTaskRepository $repository;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
    }

    public function search(): array
    {
        return $this->repository->search();
    }
}