<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Client\ClientUpdaterService;

final readonly class ClientPutController {
    private ClientUpdaterService $service;

    public function __construct() {
        $this->service = new ClientUpdaterService();
    }

    public function start(int $id): void
    {
        $name = ControllerUtils::getPost("name");
        $cuitCuil = ControllerUtils::getPost("cuitCuil");
        $address = ControllerUtils::getPost("address");
        $city = ControllerUtils::getPost("city");
        $province = ControllerUtils::getPost("province");
        $email = ControllerUtils::getPost("email");
        $phone = ControllerUtils::getPost("phone");
       // $createdAt = ControllerUtils::getPost("createdAt");
        $createdBy = ControllerUtils::getPost("createdBy");
        $modifiedBy = ControllerUtils::getPost("modifiedBy");
        
        $this->service->update(
            $id,
            $name,
            $cuitCuil,
            $address,
            $city,
            $province,
            $email,
            $phone,
            //$createdAt,
            $createdBy,
            $modifiedBy
        );
    }
}