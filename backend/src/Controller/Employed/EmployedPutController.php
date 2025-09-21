<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Employed\EmployedUpdaterService;

final readonly class EmployedPutController {
    private EmployedUpdaterService $service;

    public function __construct() {
        $this->service = new EmployedUpdaterService();
    }

    public function start(int $id): void
    {
        $name = ControllerUtils::getPost("name");
        $cuilCuit = ControllerUtils::getPost("cuilCuit");
        $phone = ControllerUtils::getPost("phone");
        $email = ControllerUtils::getPost("email");
        $address = ControllerUtils::getPost("address");

        $this->service->update($name, $cuilCuit, $phone, $email, $address, $id);
    }
}