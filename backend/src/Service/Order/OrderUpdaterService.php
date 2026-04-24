<?php 

namespace Src\Service\Order;

use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrderUpdaterService {
    private OrderRepository $repository;
    private OrderFinderService $finder;

    public function __construct() {
        $this->repository = new OrderRepository();
        $this->finder = new OrderFinderService();
    }

    public function update(int $idClient, int $idVehicle, int $idOrderTask, int $id, ?string $modifiedBy = null): void
    {
        $order = $this->finder->find($id);

        $order->modify($idClient, $idVehicle, $idOrderTask, $modifiedBy);

        $this->repository->update($order);
    }
}
