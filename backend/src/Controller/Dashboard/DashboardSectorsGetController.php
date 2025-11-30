<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Dashboard\DashboardService;

final readonly class DashboardSectorsGetController extends AuthMiddleware {
    private DashboardService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new DashboardService();
    }

    public function start(): void 
    {
        try {
            $sectors = $this->service->getSectorStats();
            
            echo json_encode([
                "data" => $sectors
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "error" => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
        }
    }
}
