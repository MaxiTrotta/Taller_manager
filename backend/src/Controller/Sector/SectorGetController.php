<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Sector\SectorFinderService;

final readonly class SectorGetController extends AuthMiddleware {
    private SectorFinderService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new SectorFinderService();
    }

    public function start(int $id): void 
    {
        $domain = $this->service->find($id);

        echo json_encode([
            "id" => $domain->id(),
            "name" => $domain->name()
        ], true);
    }
}
