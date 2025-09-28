<?php 

namespace Src\Entity\Task;

final class Task {

    public function __construct(
        private readonly ?int $id,
        private string $description,
        private bool $deleted
    ) {
    }

    public static function create(string $description): self
    {
        return new self(null, $description, false);
    }

    public function modify(string $description): void
    {
        $this->description = $description;
    }

    public function delete(): void
    {
        $this->deleted = true;
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function description(): string
    {
        return $this->description;
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}