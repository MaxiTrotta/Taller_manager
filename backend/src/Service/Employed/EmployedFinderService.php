<?php 


declare(strict_types = 1);

namespace Src\Service\Employed;

use Src\Entity\Employed\EmployeeProjection;
use Src\Entity\Employed\Employed;
use Src\Entity\Employed\Exception\EmployedNotFoundException;
use Src\Infrastructure\Repository\Employed\EmployedRepository;

final readonly class EmployedFinderService {

    private EmployedRepository $employedRepository;

    public function __construct() 
    {
        $this->employedRepository = new EmployedRepository();
    }

    public function findProjection(int $id): EmployeeProjection 
    {
        $employedProjection = $this->employedRepository->findProjection($id);

        if ($employedProjection === null) {
            throw new EmployedNotFoundException($id);
        }

        return $employedProjection;
    }
    public function find(int $id): Employed
    {
        $employed = $this->employedRepository->find($id);

        if ($employed === null) {
            throw new EmployedNotFoundException($id);
        }

        return $employed;
    }

}
