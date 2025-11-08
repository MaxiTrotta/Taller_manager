<?php 

namespace Src\Entity\User;

use DateTime;

final class User {

    public function __construct(
        private readonly ?int $id,
        private string $name,
        private string $email,
        private string $password,
        private ?string $token,
        private ?DateTime $tokenAuthDate,
        private bool $admin,
        private bool $deleted
    ) {
    }

    public static function create(string $name, string $email, string $password, bool $admin): self
    {
        return new self(null, $name, $email, password_hash($password, PASSWORD_BCRYPT), null, null, $admin, false);
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function email(): string
    {
        return $this->email;
    }

    public function password(): string
    {
        return $this->password;
    }

    public function token(): ?string
    {
        return $this->token;
    }

    public function tokenAuthDate(): ?DateTime
    {
        return $this->tokenAuthDate;
    }

    public function generateToken(): void
    {
        $this->token = md5($this->email.$this->id.rand(1000, 9999).date("YmdHis"));
        $this->tokenAuthDate = new DateTime("+5 hours");
    }
    public function admin(): bool
    {
        return $this->admin;
    }

    public function isAdmin(): int
    {
        return $this->admin ? 1 : 0;
    }

     public function delete(): void
    {
        $this->deleted = true;
    }

    public function isDeleted(): int
    {
        return $this->deleted ? 1 : 0;
    }

    public function modify(string $name, string $email, string $password, bool $admin): void
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = password_hash($password, PASSWORD_BCRYPT);
        $this->admin = $admin;
    }
}