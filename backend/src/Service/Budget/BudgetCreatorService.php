<?php 

namespace Src\Service\Budget;

use Src\Entity\Budget\Budget;
use Src\Infrastructure\Repository\Budget\BudgetRepository;
use Src\Infrastructure\Repository\Budget\BudgetLineRepository;
use Src\Entity\Budget\BudgetLine;

final readonly class BudgetCreatorService {
    private BudgetRepository $repository;

    public function __construct() {
        $this->repository = new BudgetRepository();
    }

    /**
     * @param array{description:string,price:float}[] $lines
     */
    public function create(int $idClient, string $description, float $total_amount, array $lines = []): int
    {
        $budget = Budget::create($idClient, $description, $total_amount);
        $lastInsertedId = $this->repository->insert($budget);

        if (!empty($lines)) {
            $lineRepo = new BudgetLineRepository();
            foreach ($lines as $l) {
                $line = new BudgetLine(
                    null,
                    $lastInsertedId,
                    (string)($l['description'] ?? ''),
                    (float)($l['price'] ?? 0),
                    false
                );
                $lineRepo->insert($line);
            }
        }

        return $lastInsertedId;
    }
}