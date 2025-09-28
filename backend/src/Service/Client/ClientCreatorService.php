<?php 

namespace Src\Service\Client;

use DateTime;
use Src\Entity\Client\Client;
use Src\Infrastructure\Repository\Client\ClientRepository;

final readonly class ClientCreatorService {
    private ClientRepository $repository;

    public function __construct() {
        $this->repository = new ClientRepository();
    }

    public function create(
        string $name,
        string $cuitCuil,
        string $address,
        string $city,
        string $province,
        string $email,
        string $phone,
        //?DateTime $createdAt,
        // string $createdBy,
        // ?string $modifiedBy,
        ): void
    {
        $client = Client::create(
            $name,
            $cuitCuil,
            $address,
            $city,
            $province,
            $email,
            $phone,
            //$createdAt,
            // $createdBy,
            // $modifiedBy
        );
        $this->repository->create($client);
    } 
}