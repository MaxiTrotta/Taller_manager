<?php 

namespace Src\Entity\Order;

use Src\Entity\OrderTask\OrderTaskProjection;

final class OrderProjection {

    public function __construct(
        private readonly int $id,
        private readonly string $client,
        private readonly string $vehicle,
        private readonly string $creationDate,
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

    public function creationDate(): string
    {
        return $this->creationDate;
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
        $state = 1; // por defecto Pendiente
        $cantidadFinalizados = 0;
        foreach ($this->orderTaskProjection as $task) {
            $taskState = strtoupper(trim((string)$task->state()));
            if ($taskState === 'EN PROCESO' || $taskState === 'EN PROCESO') {
                // si alguna tarea está en proceso, la orden está en proceso
                return 2;
            } elseif ($taskState === 'FINALIZADO') {
                $cantidadFinalizados++;
            }
        }

        if ($cantidadFinalizados === count($this->orderTaskProjection)) {
            $state = 3; // todas finalizadas
        }

        return $state;
    }
}