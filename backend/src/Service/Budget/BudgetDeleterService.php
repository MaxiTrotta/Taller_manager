<?php 

namespace Src\Service\Budget;

use Src\Infrastructure\Repository\Budget\BudgetRepository;

final readonly class BudgetDeleterService {
    private BudgetRepository $repository;
    private BudgetFinderService $finder;

    public function __construct() {
        $this->repository = new BudgetRepository();
        $this->finder = new BudgetFinderService();
    }

    public function delete(int $id): void
    {
        $budget = $this->finder->find($id);

        $budget->delete();

        $this->repository->update($budget);
    }
}