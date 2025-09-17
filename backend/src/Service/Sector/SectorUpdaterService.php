<?php 

namespace Src\Service\Sector;

use Src\Infrastructure\Repository\Sector\SectorRepository;

final readonly class SectorUpdaterService {
    private SectorRepository $repository;
    private SectorFinderService $finder;

    public function __construct() {
        $this->repository = new SectorRepository();
        $this->finder = new SectorFinderService();
    }

    public function update(string $name, int $id): void
    {
        $sector = $this->finder->find($id);

        $sector->modify($name);

        $this->repository->update($sector);
    }
}