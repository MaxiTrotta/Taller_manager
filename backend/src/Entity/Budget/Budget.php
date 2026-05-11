<?php 

namespace Src\Entity\Budget;

final class Budget {

    public function __construct(
        private readonly ?int $id,
        private int $idClient,
        private string $description,
        private float $total_amount,
        private bool $deleted
    ) {
    }

    public static function create(
        int $idClient,
        string $description,
        float $total_amount
        ): self
    {
        return new self(
            null,
            $idClient,
            $description,
            $total_amount,
            false);
    }

    public function modify(
        int $idClient,
        string $description,
        float $total_amount
        ): void
    {
        $this->idClient = $idClient;
        $this->description = $description;
        $this->total_amount = $total_amount;
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

    public function description(): string
    {
        return $this->description;
    }
    public function total_amount(): float
    {
        return $this->total_amount;
    }
    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}