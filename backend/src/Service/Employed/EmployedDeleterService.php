<?php 

namespace Src\Service\Employed;

use Src\Infrastructure\Repository\Employed\EmployedRepository;

final readonly class EmployedDeleterService {
    private EmployedRepository $repository;
    private EmployedFinderService $finder;

    public function __construct() {
        $this->repository = new EmployedRepository();
        $this->finder = new EmployedFinderService();
    }

    public function delete(int $id): void
    {
        $employed = $this->finder->find($id);

        $employed->delete();

        $this->repository->update($employed);
    }
}