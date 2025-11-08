<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\User;

use DateTime;
use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\User\User;

final readonly class UserRepository extends PDOManager implements UserRepositoryInterface {

    public function findByEmail(string $email): ?User 
    {
        $query = <<<HEREDOC
                        SELECT
                            *
                        FROM
                            users
                        WHERE
                            email = :email AND deleted = 0
                    HEREDOC;

        $parameters = [
            "email" => $email,
        ];

        $result = $this->execute($query, $parameters);
        
        $user = $this->primitiveToUser($result[0] ?? null); 

        if (empty($user)) {
            return null;
        }

        return $user;
    }

    public function findByEmailAndPassword(string $email, string $password): ?User 
    {
        $user = $this->findByEmail($email);

        if (empty($user)) {
            return null;
        }

        if (password_verify($password, $user->password())) {
            return $user;
        }
        
        return null;
    }

    public function findByToken(string $token): ?User 
    {
        $query = <<<HEREDOC
                    SELECT
                        *
                    FROM
                        users
                    WHERE
                        (token = :token AND :date <= token_auth_date) AND deleted = 0
                HEREDOC;

        $parameters = [
            "token" => $token,
            "date" => date("Y-m-d H:i:s"),
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToUser($result[0] ?? null);
    }

    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT
                            *
                        FROM
                            users
                        WHERE
                            deleted = 0
                    HEREDOC;
        $results = $this->execute($query);

        $userResults = [];
        foreach ($results as $result) {
            $userResults[] = $this->primitiveToUser($result);
        }

        return $userResults;
    }


    public function insert(User $user): void
    {
        $query = <<<INSERT_QUERY
                    INSERT INTO
                        users
                    (name, email, password, token, admin, deleted)
                        VALUES
                    (:name, :email, :password, :token, :admin, :deleted)
                INSERT_QUERY;
            
        $parameters = [
            "name" => $user->name(),
            "email" => $user->email(),
            "password" => $user->password(),
            "token" => "",
            "admin" => $user->isAdmin(),
            "deleted" => $user->isDeleted(),
        ];

        $this->execute($query, $parameters);
    }

    public function update(User $user): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            users
                        SET
                            email = :email,
                            password = :password,
                            token = :token,
                            token_auth_date = :tokenAuthDate,
                            admin = :admin,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "email" => $user->email(),
            "password" => $user->password(),
            "token" => $user->token(),
            "tokenAuthDate" => $user->tokenAuthDate()->format("Y-m-d H:i:s"),
            "admin" => $user->isAdmin(),
            "deleted" => $user->isDeleted(),
            "id" => $user->id()
        ];

        $this->execute($query, $parameters);
    }

    private function primitiveToUser(?array $primitive): ?User
    {
        if ($primitive === null) {
            return null;
        }

        return new User(
            $primitive["id"],
            $primitive["name"],
            $primitive["email"],
            $primitive["password"],
            $primitive["token"],
            new DateTime($primitive["token_auth_date"]),
            (bool)$primitive["admin"],
            (bool)$primitive["deleted"],
        );
    }
}