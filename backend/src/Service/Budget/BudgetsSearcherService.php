<?php 

namespace Src\Service\Budget;

use Src\Infrastructure\Repository\Budget\BudgetRepository;
use Src\Service\Client\ClientsSearcherService;

final readonly class BudgetsSearcherService {

    private BudgetRepository $repository;
    private ClientsSearcherService $clientsSearcherService;


    public function __construct() {
        $this->repository = new BudgetRepository();
        $this->clientsSearcherService = new ClientsSearcherService();
    }

    public function searchProjections(): array
    {
        $budgets = $this->repository->searchProjections();  
        $clients = $this->clientsSearcherService->search();

        foreach ($budgets as $budget) {
            $budget->client($clients[$budget->id()] ?? "");
        }

        return $budgets;
    }
}