<?php 


declare(strict_types = 1);

namespace Src\Service\Sector;

use Src\Entity\Sector\Sector;
use Src\Entity\Sector\Exception\SectorNotFoundException;
use Src\Infrastructure\Repository\Sector\SectorRepository;

final readonly class SectorFinderService {

    private SectorRepository $sectorRepository;

    public function __construct() 
    {
        $this->sectorRepository = new SectorRepository();
    }

    public function find(int $id): Sector 
    {
        $sector = $this->sectorRepository->find($id);

        if ($sector === null) {
            throw new SectorNotFoundException($id);
        }

        return $sector;
    }

}
