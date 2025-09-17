<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Sector;

use Src\Entity\Sector\Sector;

interface SectorRepositoryInterface {
    public function find(int $id): ?Sector;

    /** @return Sector[] */
    public function search(): array;

    public function insert(Sector $sector): void;

    public function update(Sector $sector): void;
}