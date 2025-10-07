<?php 

namespace Src\Service\Vehicle;

use Src\Entity\Vehicle\Vehicle;
use Src\Infrastructure\Repository\Vehicle\VehicleRepository;

final readonly class VehiclesSearcherService {
    private VehicleRepository $repository;

    public function __construct() {
        $this->repository = new VehicleRepository();
    }

    /** @return Vehicle[] */
    public function search(?int $clientId): array
    {
        if (!empty($clientId)) {
            return $this->repository->searchByClient($clientId);
        }

        return $this->repository->search();
    }
}