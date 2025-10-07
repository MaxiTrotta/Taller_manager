<?php 

use Src\Service\Employed\EmployeesSearcherService;

final readonly class EmployeesGetController {

    private EmployeesSearcherService $service;

    public function __construct() {
        $this->service = new EmployeesSearcherService();
    }

    public function start(): void 
    {
        $response = $this->service->searchProjections();
        echo json_encode($this->filterResponses($response), true);
    }

    private function filterResponses(array $responses): array
    {
        $result = [];

        foreach ($responses as $response) {
            $result[] = [
                "id" => $response->id(),
                "idSector" => $response->idSector(),
                "sectorName" => $response->sectorName(),
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
