<?php 

namespace Src\Controller\User;
use Src\Service\User\UsersSearcherService;

final readonly class UsersGetController {

    private UsersSearcherService $service;

    public function __construct() {
        $this->service = new UsersSearcherService();
    }

    public function start(): void 
    {
        $response = $this->service->search();
        echo json_encode($this->filterResponses($response), true);
    }

    private function filterResponses(array $responses): array
    {
        $result = [];

        foreach ($responses as $response) {
            $result[] = [
                "id" => $response->id(),
                "name" => $response->name(),
                "email" => $response->email(),
                "password" => $response->password(),
                "token" => $response->token(),
                "tokenAuthDate" => $response->tokenAuthDate()
            ];
        }

        return $result;
    }
}
