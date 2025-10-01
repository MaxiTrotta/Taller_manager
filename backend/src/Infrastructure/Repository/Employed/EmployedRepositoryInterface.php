<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Employed;

use Src\Entity\Employed\Employed;
use Src\Entity\Employed\EmployeeProjection;

interface EmployedRepositoryInterface {
    public function find(int $id): ?EmployeeProjection;

    /** @return EmployeeProjection[] */
    public function search(): array;

    public function insert(Employed $employed): void;

    public function update(Employed $employed): void;
}