<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Sector\SectorUpdaterService;

final readonly class SectorPutController {
    private SectorUpdaterService $service;

    public function __construct() {
        $this->service = new SectorUpdaterService();
    }

    public function start(int $id): void
    {
        $name = ControllerUtils::getPost("name");

        $this->service->update($name, $id);
    }
}