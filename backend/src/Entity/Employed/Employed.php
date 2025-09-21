<?php 

namespace Src\Entity\Employed;

final class Employed {

    public function __construct(
        private readonly ?int $id,
        private ?int $idSector,
        private string $name,
        private string $cuilCuit,
        private string $phone,
        private string $email,
        private string $address,
        private bool $deleted
    ) {
    }

    public static function create(string $name, string $cuilCuit, string $phone, string $email, string $address): self
    {
        return new self(null, null, $name, $cuilCuit, $phone, $email, $address, false);
    }

    public function modify(string $name, string $cuilCuit, string $phone, string $email, string $address): void
    {
        $this->name = $name;
        $this->cuilCuit = $cuilCuit;
        $this->phone = $phone;
        $this->email = $email;
        $this->address = $address;
    }

    
    public function id(): ?int
    {
        return $this->id;
    }
    
    public function idSector(): ?int
    {
        return $this->idSector;
    }
    
    public function name(): string
    {
        return $this->name;
    }
    
    public function cuilCuit(): string
    {
        return $this->cuilCuit;
    }
    public function phone(): string
    {
        return $this->phone;
    }
    public function email(): string
    {
        return $this->email;
    }
    public function address(): string
    {
        return $this->address;
    }
    public function delete(): void
    {
        $this->deleted = true;
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }
}