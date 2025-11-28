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
           // clientId may be sent as 'clientId' or 'client_id' and is optional
        $clientId = null;
        try {
            $clientId = ControllerUtils::getGet('clientId', false, null);
        } catch (Exception $e) {
            // try alternative param name
            try {
                $clientId = ControllerUtils::getGet('client_id', false, null);
            } catch (Exception $e) {
                $clientId = null;
            }
        }

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
