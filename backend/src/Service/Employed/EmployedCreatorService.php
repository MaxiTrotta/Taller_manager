<?php 

namespace Src\Service\Employed;

use Src\Entity\Employed\Employed;
use Src\Infrastructure\Repository\Employed\EmployedRepository;

final readonly class EmployedCreatorService {
    private EmployedRepository $repository;

    public function __construct() {
        $this->repository = new EmployedRepository();
    }

    public function create(int $idSector, string $name, string $cuilCuit, string $phone, string $email, string $address): void
    {
        $employed = Employed::create($idSector,$name, $cuilCuit, $phone, $email, $address);
        $this->repository->insert($employed);
    }
}