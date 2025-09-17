<?php 

namespace Src\Entity\Employed;

final class Employed {

    public function __construct(
        private readonly ?int $id,
        private ?int $idSector,
        private string $name,
        private string $cuil,
        private string $phone,
        private string $email,
        private string $address,
        private bool $deleted
    ) {
    }

    public static function create(string $name, string $cuil, string $phone, string $email, string $address): self
    {
        return new self(null, null, $name, $cuil, $phone, $email, $address, false);
    }

    public function modify(string $name, string $cuil, string $phone, string $email, string $address): void
    {
        $this->name = $name;
        $this->cuil = $cuil;
        $this->phone = $phone;
        $this->email = $email;
        $this->address = $address;
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

    public function code(): string
    {
        return $this->code;
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}