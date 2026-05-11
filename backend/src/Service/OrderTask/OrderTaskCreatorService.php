<?php 

namespace Src\Service\OrderTask;

use DateTime;
use Src\Entity\OrderTask\OrderTask;
use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;

final readonly class OrderTaskCreatorService {
    private OrderTaskRepository $repository;
    private \Src\Infrastructure\Repository\Order\OrderRepository $orderRepository;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
        $this->orderRepository = new \Src\Infrastructure\Repository\Order\OrderRepository();
    }

    public function create(
            ?int $idOrder,
           // ?DateTime $date,
           ?string $state,
           // int $createdBy,
            //string $assignedTo,
            ?int $idSector,
            ?int $idTask,
            ?string $note,
            ?string $modifiedBy = null
        ): void
    {
        $orderTask = OrderTask::create(
                $idOrder,
                // $date,
                $state,
               // $createdBy,
                //$assignedTo,
                $idSector,
                $idTask,
                $note
            );
        $this->repository->insert($orderTask);

        // touch parent order modification timestamp
        if ($idOrder) {
            $this->orderRepository->touchModified($idOrder, $modifiedBy);
        }
    }
}