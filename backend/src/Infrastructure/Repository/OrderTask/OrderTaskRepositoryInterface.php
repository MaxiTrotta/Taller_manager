<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\OrderTask;

use Src\Entity\OrderTask\OrderTask;

interface OrderTaskRepositoryInterface {
    public function find(int $id): ?OrderTask;

    /** @return OrderTask[] */
    public function search(): array;

    public function insert(OrderTask $orderTask): void;

    public function update(OrderTask $orderTask): void;
}