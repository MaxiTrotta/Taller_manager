<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Employed;

use Src\Entity\Employed\Employed;
use Src\Entity\Employed\EmployeeProjection;

interface EmployedRepositoryInterface {
    public function findProjection(int $id): ?EmployeeProjection;
    public function find(int $id): ?Employed;

    /** @return EmployeeProjection[] */
    public function search(): array;

    public function insert(Employed $employed): void;

    public function update(Employed $employed): void;
}