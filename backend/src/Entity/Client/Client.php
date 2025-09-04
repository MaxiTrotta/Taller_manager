<?php

namespace src\Entity\Client;

final class Client
{
    public function __construct(
        private readonly ?int $id,
        private int $dni,
        private string $name,
        private int $cuitCuil,
        private string $address,
        private string $city,
        private string $province,
        private string $email,
        private int $phone,
        private \DateTimeImmutable $createdAt,
        private string $createdBy,
        private ?string $modifiedBy,
        private bool $deleted
    ) {
    }

    // Getters
    public function id(): ?int
    {
        return $this->id;
    }
    public function dni(): int
    {
        return $this->dni;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function cuitCuil(): string
    {
        return $this->cuitCuil;
    }

    public function address(): string
    {
        return $this->address;
    }

    public function city(): string
    {
        return $this->city;
    }

    public function province(): string
    {
        return $this->province;
    }

    public function email(): string
    {
        return $this->email;
    }

    public function phone(): string
    {
        return $this->phone;
    }

    public function createdAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function createdBy(): string
    {
        return $this->createdBy;
    }

    public function modifiedBy(): ?string
    {
        return $this->modifiedBy;
    }

    public function delete(): void
    {
        $this->deleted = true;
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }

    public static function create(
        int $dni,
        string $name,
        string $cuitCuil,
        string $address,
        string $city,
        string $province,
        string $email,
        int $phone,
        \DateTimeImmutable $createdAt,
        string $createdBy,
        ?string $modifiedBy
    ): self {
        return new self(
            null,
            $dni,
            $name,
            $cuitCuil,
            $address,
            $city,
            $province,
            $email,
            $phone,
            $createdAt,
            $createdBy,
            null,
            false
        );
    }

    public function modify(
        int $dni,
        string $name,
        int $cuitCuil,
        string $address,
        string $city,
        string $province,
        string $email,
        int $phone,
        string $createdBy,
        string $modifiedBy
    ): void {
        $this->dni = $dni;
        $this->name = $name;
        $this->cuitCuil = $cuitCuil;
        $this->address = $address;
        $this->city = $city;
        $this->province = $province;
        $this->email = $email;
        $this->phone = $phone;
        $this->createdBy = $createdBy;
        $this->modifiedBy = $modifiedBy;
    }
}