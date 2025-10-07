<?php 


declare(strict_types = 1);

namespace Src\Service\OrderTask;

use Src\Entity\OrderTask\OrderTask;
use Src\Entity\OrderTask\OrderTaskProjection;
use Src\Entity\OrderTask\Exception\OrderTaskNotFoundException;
use Src\Infrastructure\Repository\OrderTask\OrderTaskRepository;

final readonly class OrderTaskFinderService {

    private OrderTaskRepository $orderTaskRepository;

    public function __construct() 
    {
        $this->orderTaskRepository = new OrderTaskRepository();
    }

    public function find(int $id): OrderTask 
    {
        $orderTask = $this->orderTaskRepository->find($id);

        if ($orderTask === null) {
            throw new OrderTaskNotFoundException($id);
        }

        return $orderTask;
    }

    public function findProjection(int $id): OrderTaskProjection
    {
        $orderTaskProjection = $this->orderTaskRepository->findProjection($id);

        if ($orderTaskProjection === null) {
            throw new OrderTaskNotFoundException($id);
        }

        return $orderTaskProjection;
    }

}
