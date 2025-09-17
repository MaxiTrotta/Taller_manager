<?php 

use Src\Service\Sector\SectorDeleterService;

final readonly class SectorDeleteController {
    private SectorDeleterService $service;

    public function __construct() {
        $this->service = new SectorDeleterService();
    }

    public function start(int $id): void
    {
        $this->service->delete($id);
    }
}