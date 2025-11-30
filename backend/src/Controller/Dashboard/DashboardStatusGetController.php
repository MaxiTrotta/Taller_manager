<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Dashboard\DashboardService;

final readonly class DashboardStatusGetController extends AuthMiddleware {
    private DashboardService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new DashboardService();
    }

    public function start(): void 
    {
        try {
            $statuses = $this->service->getOrdersStatus();
            
            echo json_encode([
                "data" => $statuses
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "error" => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
        }
    }
}
