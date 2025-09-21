<?php 

use Src\Middleware\AuthMiddleware;
use Src\Service\Client\ClientFinderService;

final readonly class ClientGetController extends AuthMiddleware {
    private ClientFinderService $service;

    public function __construct() {
        parent::__construct();
        $this->service = new ClientFinderService();
    }

    public function start(int $id): void 
    {
        $client = $this->service->find($id);

        echo json_encode([
            "id" => $client->id(),
            "name" => $client->name(),
            "cuitCuil" => $client->cuitCuil(),
            "address" => $client->address(),
            "city" => $client->city(),
            "province" => $client->province(),
            "email" => $client->email(),
            "phone" => $client->phone(),
            "createdAt" => $client->createdAt(),
            "createdBy" => $client->createdBy(),
            "modifiedBy" => $client->modifiedBy(),
        ], true);
    }
}
