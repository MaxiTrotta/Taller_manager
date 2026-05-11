<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Budget;

use Src\Entity\Budget\Budget;

interface BudgetRepositoryInterface {
    public function find(int $id): ?Budget;

    /** @return Budget[] */
    public function search(): array;

    public function insert(Budget $budget): int;

    public function update(Budget $budget): void;
}