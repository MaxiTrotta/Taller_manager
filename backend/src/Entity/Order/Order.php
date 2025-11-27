<?php 

namespace Src\Entity\Order;

use DateTime;

final class Order {

    public function __construct(
        private readonly ?int $id,
        private int $idClient,
        private int $idVehicle,
        private int $idOrderTask,
        private ?DateTime $creationDate = null,
        private bool $deleted
    ) {
    }

    public static function create(
        int $idClient,
        int $idVehicle,
        int $idOrderTask
        ): self
    {
        return new self(
            null,
            $idClient,
            $idVehicle,
            $idOrderTask,
            new Datetime(),
            false
        );
    }

    public function modify(int $idClient, int $idVehicle, int $idOrderTask): void
    {
        $this->idClient = $idClient;
        $this->idVehicle = $idVehicle;
        $this->idOrderTask = $idOrderTask;
        // Actualizar fecha de creación cuando se modifica
        $this->creationDate = new DateTime();
    }

    public function delete(): void
    {
        $this->deleted = true;
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function idClient(): int
    {
        return $this->idClient;
    }

    public function idVehicle(): int
    {
        return $this->idVehicle;
    }

    public function idOrderTask(): int
    {
        return $this->idOrderTask;
    }

    public function creationDate(): ?string
    {
        return $this->creationDate?->format('Y-m-d H:i:s');
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}
