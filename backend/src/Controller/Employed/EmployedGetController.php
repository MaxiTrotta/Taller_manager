<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Employed\EmployedFinderService;

final readonly class EmployedGetController extends AuthMiddleware {
    private EmployedFinderService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new EmployedFinderService();
    }

    public function start(int $id): void 
    {
        $employed = $this->service->findProjection($id);

        echo json_encode([
            "id" => $employed->id(),
            "idSector" => $employed->idSector(),
            "sectorName" => $employed->sectorName(),
            "name" => $employed->name(),
            "cuilCuit" => $employed->cuilCuit(),
            "phone" => $employed->phone(),
            "email" => $employed->email(),
            "address" => $employed->address(),
        ], true);
    }
}
