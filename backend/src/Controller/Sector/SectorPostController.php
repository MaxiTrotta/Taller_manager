<?php

use Src\Utils\ControllerUtils;
use Src\Service\Sector\SectorCreatorService;

final readonly class SectorPostController {
    private SectorCreatorService $service;

    public function __construct() {
        $this->service = new SectorCreatorService();
    }

    public function start(): void
    {
        $name = ControllerUtils::getPost("name");

        $this->service->create($name);
    }
}