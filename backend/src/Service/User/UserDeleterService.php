<?php 

namespace Src\Service\User;

use Src\Infrastructure\Repository\User\UserRepository;

final readonly class UserDeleterService {
    private UserRepository $repository;
    private UserFinderByEmailService $finder;

    public function __construct() {
        $this->repository = new UserRepository();
        $this->finder = new UserFinderByEmailService();
    }

    public function delete(string $email): void
    {
        $user = $this->finder->find($email);

        $user->delete();

        $this->repository->update($user);
    }
}