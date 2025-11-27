<?php

namespace Src\Service\Vehicle;

use Src\Entity\Vehicle\Vehicle;
use Src\Entity\Vehicle\Exception\VehicleLicensePlateAlreadyExistsException;
use Src\Infrastructure\Repository\Vehicle\VehicleRepository;

final readonly class VehicleUpdaterService
{
    private VehicleRepository $repository;
    private VehicleFinderService $finder;

    public function __construct()
    {
        $this->repository = new VehicleRepository();
        $this->finder = new VehicleFinderService();
    }

    public function update(
        ?int $id,
        int $clientId,
        string $licensePlate,
        string $brand,
        string $model,
        ?int $year
    ): void {
        $vehicle = $this->finder->find($id);

        // Validar que la patente no esté duplicada (excluyendo el vehículo actual)
        $existingVehicle = $this->repository->findByLicensePlate($licensePlate);
        if (!empty($existingVehicle) && $existingVehicle->id() !== $id) {
            throw new VehicleLicensePlateAlreadyExistsException($licensePlate);
        }

        $vehicle->modify(
            $clientId,
            $licensePlate,
            $brand,
            $model,
            $year
        );

        $this->repository->update($vehicle);
    }
}
