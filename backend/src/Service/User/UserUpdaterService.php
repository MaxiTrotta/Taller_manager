<?php 

namespace Src\Service\User;

use Src\Infrastructure\Repository\User\UserRepository;

final readonly class UserUpdaterService {
    private UserRepository $repository;
    private UserFinderByEmailService $finder;

    public function __construct() {
        $this->repository = new UserRepository();
        $this->finder = new UserFinderByEmailService();
    }

    public function update(string $email, string $name, string $password, bool $admin): void
    {
        $user = $this->finder->find($email);

        $user->modify($name, $email, $password, $admin);

        $this->repository->update($user);
    }
}