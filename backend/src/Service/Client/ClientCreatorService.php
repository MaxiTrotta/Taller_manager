<?php 

namespace Src\Service\Client;

use Src\Entity\Client\Client;
use Src\Infrastructure\Repository\Client\ClientRepository;

final readonly class ClientCreatorService {
    private ClientRepository $repository;

    public function __construct() {
        $this->repository = new ClientRepository();
    }

    public function create(
        int $dni,
        string $name,
        int $cuitCuil,
        string $address,
        string $city,
        string $province,
        string $email,
        int $phone,
        \DateTimeImmutable $createdAt,
        string $createdBy,
        ?string $modifiedBy,
        ): void
    {
        $client = Client::create(
            $dni,
            $name,
            $cuitCuil,
            $address,
            $city,
            $province,
            $email,
            $phone,
            $createdAt,
            $createdBy,
            $modifiedBy
        );
        $this->repository->create($client);
    } 
}