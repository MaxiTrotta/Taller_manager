<?php 

namespace Src\Service\OrderTask;

use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;
use DateTime;
final readonly class OrderTaskUpdaterService {
    private OrderTaskRepository $repository;
    private OrderTaskFinderService $finder;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
        $this->finder = new OrderTaskFinderService();
    }

    public function update(
        int $idOrder,
        //DateTime $date,
        string $state,
        //string $createdBy,
        //string $assignedTo,
        int $id
    ): void {
        $orderTask = $this->finder->find($id);

        $orderTask->modify($idOrder,$state, $id);

        $this->repository->update($orderTask);
    }
}