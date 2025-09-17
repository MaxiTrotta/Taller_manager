<?php 

namespace Src\Service\Sector;

use Src\Infrastructure\Repository\Sector\SectorRepository;

final readonly class SectorsSearcherService {

    private SectorRepository $repository;

    public function __construct() {
        $this->repository = new SectorRepository();
    }

    public function search(): array
    {
        return $this->repository->search();
    }
}