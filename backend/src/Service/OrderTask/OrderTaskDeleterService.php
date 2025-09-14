<?php 

namespace Src\Service\OrderTask;

use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;

final readonly class OrderTaskDeleterService {
    private OrderTaskRepository $repository;
    private OrderTaskFinderService $finder;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
        $this->finder = new OrderTaskFinderService();
    }

    public function delete(int $id): void
    {
        $orderTask = $this->finder->find($id);

        $orderTask->delete();

        $this->repository->update($orderTask);
    }
}