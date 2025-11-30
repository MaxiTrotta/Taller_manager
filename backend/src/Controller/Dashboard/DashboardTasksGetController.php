<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Dashboard\DashboardService;

final readonly class DashboardTasksGetController extends AuthMiddleware {
    private DashboardService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new DashboardService();
    }

    public function start(): void 
    {
        try {
            $tasks = $this->service->getMostPerformedTasks(5);
            
            echo json_encode([
                "data" => $tasks
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "error" => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
        }
    }
}
