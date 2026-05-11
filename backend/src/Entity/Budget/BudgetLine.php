<?php

namespace Src\Entity\Budget;

final class BudgetLine {
    public function __construct(
        private readonly ?int $id,
        private readonly int $idBudget,
        private readonly string $description,
        private readonly float $price,
        private readonly bool $deleted = false
    ) {
    }

    public static function create(int $idBudget, string $description, float $price): self
    {
        return new self(null, $idBudget, $description, $price, false);
    }

    public function id(): ?int { return $this->id; }
    public function idBudget(): int { return $this->idBudget; }
    public function description(): string { return $this->description; }
    public function price(): float { return $this->price; }
    public function isDeleted(): int { return $this->deleted ? 1 : 0; }
}
