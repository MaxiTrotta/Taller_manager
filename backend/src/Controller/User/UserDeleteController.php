<?php 

use Src\Service\User\UserDeleterService;

final readonly class UserDeleteController {
    private UserDeleterService $service;

    public function __construct() {
        $this->service = new UserDeleterService();
    }

    public function start(string $email): void
    {
        $this->service->delete($email);
    }
}