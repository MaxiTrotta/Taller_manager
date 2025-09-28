<?php 

use Src\Service\OrderTask\OrderTasksSearcherService;

final readonly class OrderTasksGetController {

    private OrderTasksSearcherService $service;

    public function __construct() {
        $this->service = new OrderTasksSearcherService();
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
               // "date" => $response->date(),
                "state" => $response->state(),
                //"createdBy" => $response->createdBy(),
                //"assignedTo" => $response->assignedTo(),
                "idSector" => $response->idSector(),
                "idTask" => $response->idTask(),
            ];
        }

        return $result;
    }
}
