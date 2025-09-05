<?php 

namespace Src\Entity\Task;

final class Task {

    public function __construct(
        private readonly ?int $id,
        private string $name,
        private bool $deleted
    ) {
    }

    public static function create(string $name): self
    {
        return new self(null, $name, false);
    }

    public function modify(string $name): void
    {
        $this->name = $name;
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

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}