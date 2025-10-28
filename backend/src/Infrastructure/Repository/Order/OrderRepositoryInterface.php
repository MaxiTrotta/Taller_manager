<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Order;

use Src\Entity\Order\Order;

interface OrderRepositoryInterface {
    public function find(int $id): ?Order;

    /** @return Order[] */
    public function search(): array;

    public function insert(Order $order): int;

    public function update(Order $order): void;
}