<?php 

use Src\Service\Order\OrdersSearcherService;

final readonly class OrdersGetController {

    private OrdersSearcherService $service;

    public function __construct() {
        $this->service = new OrdersSearcherService();
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
        $orderTaskProjection = $response->orderTaskProjection();

        $result[] = [
            "id" => $response->id(),
            "client" => $response->client(),
            "vehicle" => $response->vehicle(),
            "creationDate" => $response->creationDate(),
            "state" => $response->getOrderTaskState(),
        ];
    }

    return $result;
}

}
