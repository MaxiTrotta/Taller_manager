<?php 

use Src\Service\Sector\SectorsSearcherService;

final readonly class SectorsGetController {

    private SectorsSearcherService $service;

    public function __construct() {
        $this->service = new SectorsSearcherService();
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
                "name" => $response->name()
            ];
        }

        return $result;
    }
}
