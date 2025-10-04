<?php 

namespace Src\Entity\Vehicle;

final readonly class VehicleProjection {

     public function __construct(
        private readonly ?int $id,
        private int $clientId,
        private ?string $clientName,
        private string $licensePlate, // Patente
        private string $brand, // Marca
        private string $model, // Modelo
        private int $year // Año
    ) {
    }

    public function id(): int
    {
        return $this->id;
    }
    
    public function clientId(): int
    {
        return $this->clientId;
    }
    public function clientName(): ?string
    {
        return $this->clientName;
    }

    public function licensePlate(): string
    {
        return $this->licensePlate;
    }

    public function brand(): string
    {
        return $this->brand;
    }

    public function model(): string
    {
        return $this->model;
    }

    public function year(): int
    {
        return $this->year;
    }
    
}