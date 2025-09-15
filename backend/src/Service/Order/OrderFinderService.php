<?php 


declare(strict_types = 1);

namespace Src\Service\Order;

use Src\Entity\Order\Order;
use Src\Entity\Order\Exception\OrderNotFoundException;
use Src\Infrastructure\Repository\Order\OrderRepository;

final readonly class OrderFinderService {

    private OrderRepository $orderRepository;

    public function __construct() 
    {
        $this->orderRepository = new OrderRepository();
    }

    public function find(int $id): Order 
    {
        $order = $this->orderRepository->find($id);

        if ($order === null) {
            throw new OrderNotFoundException($id);
        }

        return $order;
    }

}
