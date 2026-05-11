<?php 


declare(strict_types = 1);

namespace Src\Service\Budget;

use Src\Entity\Budget\Budget;
use Src\Entity\Budget\BudgetProjection;
use Src\Entity\Budget\Exception\BudgetNotFoundException;
use Src\Infrastructure\Repository\Budget\BudgetRepository;
use Src\Service\Client\ClientsSearcherService;

final readonly class BudgetFinderService {

    private BudgetRepository $budgetRepository;
    private ClientsSearcherService $clientsSearcherService;

    public function __construct() 
    {
        $this->budgetRepository = new BudgetRepository();
        $this->clientsSearcherService = new ClientsSearcherService();
    }

    public function find(int $id): Budget 
    {
        $budget = $this->budgetRepository->find($id);

        if ($budget === null) {
            throw new BudgetNotFoundException($id);
        }

        return $budget;
    }
    public function findProjection(int $id): BudgetProjection 
    {
        $budgetProjection = $this->budgetRepository->findProjection($id);

        if ($budgetProjection === null) {
            throw new BudgetNotFoundException($id);
        }

        return $budgetProjection;
    }

}
