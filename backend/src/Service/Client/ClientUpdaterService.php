<?php

namespace Src\Service\Client;

use Src\Entity\Client\Client;
use Src\Infrastructure\Repository\Client\ClientRepository;

final readonly class ClientUpdaterService
{
    private ClientRepository $repository;
    private ClientFinderService $finder;

    public function __construct()
    {
        $this->repository = new ClientRepository();
        $this->finder = new ClientFinderService();
    }

    public function update(
        ?int $id,
        string $name,
        string $cuitCuil,
        string $address,
        string $city,
        string $province,
        string $email,
        string $phone,
        // string $createdBy,
        // ?string $modifiedBy,
    ): void {
        $client = $this->finder->find($id);

        $client->modify(
        $name,
        $cuitCuil,
        $address,
        $city,
        $province,
        $email,
        $phone,
        // $createdBy,
        // $modifiedBy
    );

        $this->repository->update($client);
    }
}