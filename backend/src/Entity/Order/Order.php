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
        private ?DateTime $modifiedAt = null,
        private ?string $createdBy = null,
        private ?string $modifiedBy = null,
        private bool $deleted
    ) {
    }

    public static function create(
        int $idClient,
        int $idVehicle,
        int $idOrderTask
        , ?string $createdBy = null
        ): self
    {
        return new self(
            null,
            $idClient,
            $idVehicle,
            $idOrderTask,
            new Datetime(),
            null,
            $createdBy,
            null,
            false
        );
    }

    public function modify(int $idClient, int $idVehicle, int $idOrderTask, ?string $modifiedBy = null): void
    {
        $this->idClient = $idClient;
        $this->idVehicle = $idVehicle;
        $this->idOrderTask = $idOrderTask;
        // Registrar fecha de modificación y usuario
        $this->modifiedAt = new DateTime();
        if ($modifiedBy !== null) {
            $this->modifiedBy = $modifiedBy;
        }
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

    public function modifiedAt(): ?string
    {
        return $this->modifiedAt?->format('Y-m-d H:i:s');
    }

    public function createdBy(): ?string
    {
        return $this->createdBy;
    }

    public function modifiedBy(): ?string
    {
        return $this->modifiedBy;
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}
