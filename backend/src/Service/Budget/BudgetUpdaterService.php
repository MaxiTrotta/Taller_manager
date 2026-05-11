<?php 

namespace Src\Service\Budget;

use Src\Infrastructure\Repository\Budget\BudgetRepository;
use Src\Infrastructure\Repository\Budget\BudgetLineRepository;
use Src\Entity\Budget\BudgetLine;

final readonly class BudgetUpdaterService {
    private BudgetRepository $repository;
    private BudgetFinderService $finder;

    public function __construct() {
        $this->repository = new BudgetRepository();
        $this->finder = new BudgetFinderService();
    }

    /**
     * @param array{description:string,price:float}[] $lines
     */
    public function update(int $idClient, string $description, float $total_amount, int $id, array $lines = []): void
    {
        $budget = $this->finder->find($id);

        $budget->modify($idClient, $description, $total_amount);

        $this->repository->update($budget);

        // Replace lines: soft-delete existing and insert new ones
        $lineRepo = new BudgetLineRepository();
        $lineRepo->deleteByBudget($id);

        if (!empty($lines)) {
            foreach ($lines as $l) {
                $line = new BudgetLine(
                    null,
                    $id,
                    (string)($l['description'] ?? ''),
                    (float)($l['price'] ?? 0),
                    false
                );
                $lineRepo->insert($line);
            }
        }
    }
}