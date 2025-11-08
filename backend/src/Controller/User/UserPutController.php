<?php 

use Src\Utils\ControllerUtils;
use Src\Service\User\UserUpdaterService;

final readonly class UserPutController {
    private UserUpdaterService $service;

    public function __construct() {
        $this->service = new UserUpdaterService();
    }

    public function start(string $email): void
    {
        $name = ControllerUtils::getPost("name");
        $email = ControllerUtils::getPost("email");
        $password = ControllerUtils::getPost("password");
        $admin = ControllerUtils::getPost("admin");

        $this->service->update($email, $name, $password, $admin);
    }
        
}