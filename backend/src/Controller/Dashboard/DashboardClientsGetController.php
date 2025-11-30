<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Dashboard\DashboardService;

final readonly class DashboardClientsGetController extends AuthMiddleware {
    private DashboardService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new DashboardService();
    }

    public function start(): void 
    {
        try {
            $clients = $this->service->getTopClients(10);
            
            echo json_encode([
                "data" => $clients
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "error" => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
        }
    }
}
