<?php 

namespace Src\Service\OrderTask;

use DateTime;
use Src\Entity\OrderTask\OrderTask;
use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;

final readonly class OrderTaskCreatorService {
    private OrderTaskRepository $repository;

    public function __construct() {
        $this->repository = new OrderTaskRepository();
    }

    public function create(
            ?int $idOrder,
           // ?DateTime $date,
           ?string $state,
           // int $createdBy,
            //string $assignedTo,
            ?int $idSector,
            ?int $idTask
        ): void
    {
        $orderTask = OrderTask::create(
                $idOrder,
                // $date,
                $state,
               // $createdBy,
                //$assignedTo,
                $idSector,
                $idTask
            );
        $this->repository->insert($orderTask);
    }
}