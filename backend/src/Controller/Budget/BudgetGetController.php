<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Budget\BudgetFinderService;

final readonly class BudgetGetController extends AuthMiddleware {
    private BudgetFinderService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new BudgetFinderService();
    }

    public function start(int $id): void 
    {
        $budget = $this->service->findProjection($id);

        
       /* $tasks = [];

        foreach ($order->orderTaskProjection() as $task) {
            $tasks[] = [
                "id" => $task->id(),
                "idOrder" => $task->idOrder(),
                "state" => $task->state(),
                "sectorName" => $task->sectorName(),
                "taskDescription" => $task->taskDescription(),
                "note" => $task->note(),
            ];
        }
        */

        echo json_encode([
            "id" => $budget->id(),
            "client" => $budget->client(),
            "description" => $budget->description(),
            "lines" => $budget->lines(),
            "total_amount" => $budget->total_amount(),
        ], JSON_PRETTY_PRINT);
    }
}
