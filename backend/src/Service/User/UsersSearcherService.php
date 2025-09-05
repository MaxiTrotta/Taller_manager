<?php 

namespace Src\Service\User;

use Src\Infrastructure\Repository\User\UserRepository;

final readonly class UsersSearcherService {

    private UserRepository $repository;

    public function __construct() {
        $this->repository = new UserRepository();
    }

    public function search(): array
    {
        return $this->repository->search();
    }
}