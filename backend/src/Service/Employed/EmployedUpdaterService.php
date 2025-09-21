<?php 

namespace Src\Service\Employed;

use Src\Infrastructure\Repository\Employed\EmployedRepository;

final readonly class EmployedUpdaterService {
    private EmployedRepository $repository;
    private EmployedFinderService $finder;

    public function __construct() {
        $this->repository = new EmployedRepository();
        $this->finder = new EmployedFinderService();
    }

    public function update(string $name, string $cuilCuit, string $phone, string $email, string $address, int $id): void
    {
        $employed = $this->finder->find($id);

        $employed->modify($name, $cuilCuit, $phone, $email, $address);

        $this->repository->update($employed);
    }
}