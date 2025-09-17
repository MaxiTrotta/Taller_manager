<?php 

namespace Src\Service\Sector;

use Src\Entity\Sector\Sector;
use Src\Infrastructure\Repository\Sector\SectorRepository;

final readonly class SectorCreatorService {
    private SectorRepository $repository;

    public function __construct() {
        $this->repository = new SectorRepository();
    }

    public function create(string $name): void
    {
        $sector = Sector::create($name);
        $this->repository->insert($sector);
    }
}