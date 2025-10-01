<?php 

namespace Src\Entity\Employed;

final readonly class EmployeeProjection {

    public function __construct(
        private int $id,
        private int $idSector,
        private string $sectorName,
        private string $name,
        private string $cuilCuit,
        private string $phone,
        private string $email,
        private string $address,
    ) {
    }

    public function id(): int
    {
        return $this->id;
    }
    
    public function idSector(): int
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

    public function sectorName(): string
    {
        return $this->sectorName;
    }
}