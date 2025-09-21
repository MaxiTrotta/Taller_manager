<?php 

use Src\Service\Employed\EmployeesSearcherService;

final readonly class EmployeesGetController {

    private EmployeesSearcherService $service;

    public function __construct() {
        $this->service = new EmployeesSearcherService();
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
                "cuilCuit" => $response->cuilCuit(),
                "phone" => $response->phone(),
                "email" => $response->email(),
                "address" => $response->address()
            ];
        }

        return $result;
    }
}
