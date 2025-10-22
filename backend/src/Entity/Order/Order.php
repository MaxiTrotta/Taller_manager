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
            null, //Uso null por el momento ya que la base de datos es la que le da la fecha actual con el CURRENT_TIMESTAMP
            false);
    }

    public function modify(int $idClient, int $idVehicle, int $idOrderTask): void
    {
        $this->idClient = $idClient;
        $this->idVehicle = $idVehicle;
        $this->idOrderTask = $idOrderTask;
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
        // formato compatible con JSON y JavaScript (ISO 8601)
        return $this->creationDate?->format('Y-m-d\TH:i:s');
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}