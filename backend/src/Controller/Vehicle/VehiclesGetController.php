<?php 

use Src\Utils\ControllerUtils;
use Src\Service\Vehicle\VehiclesSearcherService;

final readonly class VehiclesGetController {
    private VehiclesSearcherService $service;

    public function __construct() {
        $this->service = new VehiclesSearcherService();
    }

    public function start(): void
    {
        $clientId = ControllerUtils::getGet('clientId');

        $vehicles = $this->service->search($clientId);

        echo json_encode($this->toResponse($vehicles));
    }

    private function toResponse(array $vehicles): array 
    {
        $responses = [];
        
        foreach($vehicles as $vehicle) {
            $responses[] = [
                "id" => $vehicle->id(),
                "clientId" => $vehicle->clientId(),
                "licensePlate" => $vehicle->licensePlate(),
                "brand" => $vehicle->brand(),
                "model" => $vehicle->model(),
                "year" => $vehicle->year()
            ];
        }

        return $responses;
    }
}