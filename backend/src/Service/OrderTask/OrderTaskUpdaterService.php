<?php 

namespace Src\Service\OrderTask;

use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;
use DateTime;
final readonly class OrderTaskUpdaterService {
    private OrderTaskRepository $repository;
    private OrderTaskFinderService $finder;
    private \Src\Infrastructure\Repository\Order\OrderRepository $orderRepository;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
        $this->finder = new OrderTaskFinderService();
        $this->orderRepository = new \Src\Infrastructure\Repository\Order\OrderRepository();
    }

    public function update(
        int $idOrder,
        //DateTime $date,
        string $state,
        //string $createdBy,
        //string $assignedTo,
        int $idSector,
        int $idTask,
        string $note,
        int $id,
        ?string $modifiedBy = null
    ): void {
        $orderTask = $this->finder->find($id);

        $orderTask->modify($idOrder,$state, $idSector, $idTask, $note);

        $this->repository->update($orderTask);

        // touch parent order modification timestamp
        if ($idOrder) {
            $this->orderRepository->touchModified($idOrder, $modifiedBy);
        }
    }
}