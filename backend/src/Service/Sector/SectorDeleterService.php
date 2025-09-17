<?php 

namespace Src\Service\Sector;

use Src\Infrastructure\Repository\Sector\SectorRepository;

final readonly class SectorDeleterService {
    private SectorRepository $repository;
    private SectorFinderService $finder;

    public function __construct() {
        $this->repository = new SectorRepository();
        $this->finder = new SectorFinderService();
    }

    public function delete(int $id): void
    {
        $sector = $this->finder->find($id);

        $sector->delete();

        $this->repository->update($sector);
    }
}