<?php 

namespace Src\Entity\Order;

use Src\Entity\OrderTask\OrderTaskProjection;

final class OrderProjection {

    public function __construct(
        private readonly int $id,
        private readonly string $client,
        private readonly string $vehicle,
        private array $orderTaskProjection = [],
    ) {
    }

    public function id(): int
    {
        return $this->id;
    }

    public function client(): string
    {
        return $this->client;
    }

    public function vehicle(): string
    {
        return $this->vehicle;
    }

    public function orderTaskProjection(): array
    {
        return $this->orderTaskProjection;
    }

    public function setOrderTaskProjection(array $orderTaskProjection): void
    {
        $this->orderTaskProjection = $orderTaskProjection;
    }

    public function getOrderTaskState():int
    {
        if (empty($this->orderTaskProjection)) {
            return 0; // PENDIENTE
        }
        # 0 = SIN TAREAS
        # 1 = PENDIENTE
        # 2 = EN PROCESO
        # 3 = FINALIZADO
        $state = 1;
        $cantidadFinalizados = 0;
        foreach ($this->orderTaskProjection as $task) {
            if ($task->state() == 'EN PROCESO') {
                $state = 2;
                return $state;
            }elseif ($task->state() == 'FINALIZADO') {
                $cantidadFinalizados++;
            }
        }
        if ($cantidadFinalizados === sizeof($this->orderTaskProjection)) {
            $state = 3;
        }
        return $state;
    }
}