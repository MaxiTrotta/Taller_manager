<?php

use Src\Utils\ControllerUtils;
use Src\Service\Employed\EmployedCreatorService;

final readonly class EmployedPostController {
    private EmployedCreatorService $service;

    public function __construct() {
        $this->service = new EmployedCreatorService();
    }

    public function start(): void
    {
        $name = ControllerUtils::getPost("name");
        $cuilCuit = ControllerUtils::getPost("cuilCuit");
        $phone = ControllerUtils::getPost("phone");
        $email = ControllerUtils::getPost("email");
        $address = ControllerUtils::getPost("address");

        $this->service->create($name, $cuilCuit, $phone, $email, $address);
    }
}