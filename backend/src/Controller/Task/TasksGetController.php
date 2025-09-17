<?php 

use Src\Service\Task\TasksSearcherService;

final readonly class TasksGetController {

    private TasksSearcherService $service;

    public function __construct() {
        $this->service = new TasksSearcherService();
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
