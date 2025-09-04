<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Client\ClientCreatorService;

final readonly class ClientPostController {
    private ClientCreatorService $service;

    public function __construct() {
        $this->service = new ClientCreatorService();
    }

    public function start(): void
    {
        $dni = ControllerUtils::getPost("dni");
        $name = ControllerUtils::getPost("name");
        $cuitCuil = ControllerUtils::getPost("cuitCuil");
        $address = ControllerUtils::getPost("address");
        $city = ControllerUtils::getPost("city");
        $province = ControllerUtils::getPost("province");
        $email = ControllerUtils::getPost("email");
        $phone = ControllerUtils::getPost("phone");
        $createdAt = ControllerUtils::getPost("createdAt");
        $createdBy = ControllerUtils::getPost("createdBy");
        $modifiedBy = ControllerUtils::getPost("midifiedBy");

        $this->service->create(
            $dni,
            $name,
            $cuitCuil,
            $address,
            $city,
            $province,
            $email,
            $phone,
            $createdAt,
            $createdBy,
            $modifiedBy
        );
    }
}