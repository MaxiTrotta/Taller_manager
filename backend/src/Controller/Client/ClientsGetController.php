<?php 

use Src\Service\Client\ClientsSearcherService;

final readonly class ClientsGetController {
    private ClientsSearcherService $service;

    public function __construct() {
        $this->service = new ClientsSearcherService();
    }

    public function start(): void
    {
        $clients = $this->service->search();

        echo json_encode($this->toResponse($clients));
    }

    private function toResponse(array $clients): array 
    {
        $responses = [];
        
        foreach($clients as $client) {
            $responses[] = [
                "id" => $client->id(),
                "name" => $client->name(),
                "cuitCuil" => $client->cuitCuil(),
                "address" => $client->address(),
                "city" => $client->city(),
                "province" => $client->province(),
                "email" => $client->email(),
                "phone" => $client->phone(),
                // "createdAt" => $client->createdAt(), 
                // "createdBy" => $client->createdBy(),
                // "modifeidBy" => $client->modifiedBy(),
                "isDeleted" => $client->isDeleted(),
                
            ];
        }

        return $responses;
    }
}