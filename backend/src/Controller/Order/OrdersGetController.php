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
            "vehicleBrand" => method_exists($response, 'vehicleBrand') ? $response->vehicleBrand() : null,
            "vehicleModel" => method_exists($response, 'vehicleModel') ? $response->vehicleModel() : null,
            "creationDate" => $response->creationDate(),
            "createdBy" => method_exists($response, 'createdBy') ? $response->createdBy() : null,
            "modifiedBy" => method_exists($response, 'modifiedBy') ? $response->modifiedBy() : null,
            "modifiedAt" => method_exists($response, 'modifiedAt') ? $response->modifiedAt() : null,
            "state" => $response->getOrderTaskState(),
        ];
    }

    return $result;
}

}
