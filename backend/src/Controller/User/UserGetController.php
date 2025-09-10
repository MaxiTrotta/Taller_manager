<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\User\UserFinderByEmailService;

final readonly class UserGetController extends AuthMiddleware {
    private UserFinderByEmailService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new UserFinderByEmailService();
    }

    public function start(string $email): void 
    {
        $user = $this->service->find($email);

        echo json_encode([
            "id" => $user->id(),
            "name" => $user->name(),
            "email" => $user->email(),
            "password" => $user->password(),
            "token" => $user->token(),
            "tokenAuthDate" => $user->tokenAuthDate(),
        ], true);
    }
}
