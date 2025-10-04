<?php 

namespace Src\Service\Employed;

use Src\Infrastructure\Repository\Employed\EmployedRepository;

final readonly class EmployeesSearcherService {

    private EmployedRepository $repository;

    public function __construct() {
        $this->repository = new EmployedRepository();
    }

    public function searchProjections(): array
    {
        return $this->repository->searchProjections();
    }
}