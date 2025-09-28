<?php 

namespace Src\Service\Vehicle;

use Src\Entity\Vehicle\Vehicle;
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
        $client = $this->clientFinder->find($clientId);

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