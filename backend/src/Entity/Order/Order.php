<?php 

namespace Src\Entity\Order;

final class Order {

    public function __construct(
        private readonly ?int $id,
        private string $name,
        private int $idClient,
        private bool $deleted
    ) {
    }

    public static function create(string $name, int $idClient): self
    {
        return new self(null, $name, $idClient, false);
    }

    public function modify(string $name, int $idClient): void
    {
        $this->name = $name;
        $this->idClient = $idClient;
    }

    public function delete(): void
    {
        $this->deleted = true;
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function idClient(): string
    {
        return $this->idClient;
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}