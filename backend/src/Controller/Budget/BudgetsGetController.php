<?php 

use Src\Service\Budget\BudgetsSearcherService;

final readonly class BudgetsGetController {

    private BudgetsSearcherService $service;

    public function __construct() {
        $this->service = new BudgetsSearcherService();
    }

    public function start(): void 
    {

        $response = $this->service->searchProjections();
        echo json_encode($this->filterResponses($response), JSON_PRETTY_PRINT);
    }

    private function filterResponses(array $responses): array
    {
    $result = [];

    foreach ($responses as $response) {

        $result[] = [
            "id" => $response->id(),
            "client" => $response->client(),
            "description" => $response->description(),
            "lines" => $response->lines(),
            "total_amount" => $response->total_amount(),
        ];
    }

        return $result;
    }

}
