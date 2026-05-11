<?php 

namespace Src\Entity\Order;

use Src\Entity\OrderTask\OrderTaskProjection;

final class OrderProjection {

    public function __construct(
        private readonly int $id,
        private readonly string $client,
        private readonly string $vehiclePlate,
        private readonly ?string $vehicleBrand = null,
        private readonly ?string $vehicleModel = null,
        private readonly string $creationDate,
        private readonly ?string $createdBy = null,
        private readonly ?string $modifiedBy = null,
        private readonly ?string $modifiedAt = null,
        private array $orderTaskProjection = [],
        private bool $isClosed = false,
    ) {
    }

    public function id(): int
    {
        return $this->id;
    }

    public function isClosed(): bool
    {
        return $this->isClosed;
    }
    public function client(): string
    {
        return $this->client;
    }

    public function vehicle(): string
    {
        return $this->vehiclePlate;
    }

    public function vehicleBrand(): ?string
    {
        return $this->vehicleBrand;
    }

    public function vehicleModel(): ?string
    {
        return $this->vehicleModel;
    }

    public function creationDate(): string
    {
        return $this->creationDate;
    }

    public function createdBy(): ?string
    {
        return $this->createdBy;
    }

    public function modifiedBy(): ?string
    {
        return $this->modifiedBy;
    }

    public function modifiedAt(): ?string
    {
        return $this->modifiedAt;
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
        // 0 = SIN TAREAS
        // 1 = PENDIENTE
        // 2 = EN PROCESO
        // 3 = FINALIZADO
        // 4 = CERRADO

        if (empty($this->orderTaskProjection)) {
            return 0;
        }

        // Si la orden está marcada como cerrada, devolvemos 4
        if ($this->isClosed === true) {
            return 4;
        }

        $cantidadFinalizados = 0;
        foreach ($this->orderTaskProjection as $task) {
            $taskState = strtoupper(trim((string)$task->state()));
            if ($taskState === 'EN PROCESO') {
                return 2;
            } elseif ($taskState === 'FINALIZADO') {
                $cantidadFinalizados++;
            }
        }

        if ($cantidadFinalizados === count($this->orderTaskProjection)) {
            return 3;
        }

        return 1;
    }
}