<?php 

namespace Src\Service\Vehicle;

use Src\Entity\Vehicle\Vehicle;
use Src\Entity\Vehicle\Exception\VehicleLicensePlateAlreadyExistsException;
use Src\Service\Client\ClientFinderService;
use Src\Infrastructure\Repository\Vehicle\VehicleRepository;

final readonly class VehicleCreatorService {
    private VehicleRepository $repository;
    private ClientFinderService $clientFinder;

    public function __construct() {
        $this->repository = new VehicleRepository();
        $this->clientFinder = new ClientFinderService();
    }

    public function create(
        int $clientId,
        string $licensePlate, 
        string $brand,
        string $model, 
        ?int $year
    ): void
    {
        // Validar que el cliente existe
        $client = $this->clientFinder->find($clientId);

        // Validar que la patente no esté duplicada
        $existingVehicle = $this->repository->findByLicensePlate($licensePlate);
        if (!empty($existingVehicle)) {
            throw new VehicleLicensePlateAlreadyExistsException($licensePlate);
        }

        $vehicle = Vehicle::create(
            $client->id(),
            $licensePlate,
            $brand,
            $model,
            $year
        );

        $this->repository->create($vehicle);
    } 
}
