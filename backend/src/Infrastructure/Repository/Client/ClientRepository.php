<?php 

namespace Src\Infrastructure\Repository\Client;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Client\Client;

final readonly class ClientRepository extends PDOManager implements ClientRepositoryInterface {
    public function find(int $id): ?Client
    {
        $query = <<<HEREDOC
                        SELECT 
                            *
                        FROM
                            client C
                        WHERE
                            C.id = :id AND C.deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id,
        ];

        $result = $this->execute($query, $parameters);

        return $this->toClient($result[0] ?? null);
    }

    /** @return Client[] */
    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT
                            *
                        FROM
                            client C
                        WHERE
                            C.deleted = 0
                    HEREDOC;
        
        $results = $this->execute($query);

        $clients = [];
        foreach($results as $result) {
            $clients[] = $this->toClient($result);
        }

        return $clients;
    }

    public function create(Client $client): void
    {
        $query = <<<INSERT_QUERY
                        INSERT INTO client (dni, name, cuitCuil, address, city, province, email, phone, createdAt, createdBy, deleted)
                        VALUES (:dni, :name, :cuitCuil, :address, :city, :province, :email, :phone, :createdAT, :createdBy, :deleted)
                    INSERT_QUERY;

        $parameters = [
            "dni" => $client->dni(),
            "name" => $client->name(),
            "cuitCuil" => $client->cuitCuil(),
            "address" => $client->address(),
            "city" => $client->city(),
            "province" => $client->province(),
            "email" => $client->email(),
            "phone" => $client->phone(),
            "createdAt" => $client->createdAt(),
            "createdBy" => $client->createdBy(),
            "deleted" => $client->isDeleted()
        ];

        $this->execute($query, $parameters);
    }

    public function update(Client $client): void
    {
        $query = <<<UPDATE_CATEGORY
                    UPDATE
                        client
                    SET
                        dni = :dni,
                        name = :name,
                        cuitCuil = :cuitCuil,
                        address = :address,
                        city = :city,
                        province = :province,
                        email = :email,
                        phone = :phone,
                        createdAt = :createdAt,
                        createdBy = :createdBy,
                        modifiedBy = :modifiedBy,
                        deleted = :deleted
                    WHERE
                        id = :id
                UPDATE_CATEGORY;
        
        $parameters = [
            "dni" => $client->dni(),
            "name" => $client->name(),
            "cuitCuil" => $client->cuitCuil(),
            "address" => $client->address(),
            "city" => $client->city(),
            "province" => $client->province(),
            "email" => $client->email(),
            "phone" => $client->phone(),
            "createdAt" => $client->createdAt(),
            "createdBy" => $client->createdBy(),
            "modifiedBy" => $client->modifiedBy(),
            "deleted" => $client->isDeleted(),
            "id" => $client->id(),
        ];

        $this->execute($query, $parameters);
    }

    private function toClient(?array $primitive): ?Client {
        if ($primitive === null) {
            return null;
        }

        return new Client(
            $primitive["id"],
            $primitive["dni"],
            $primitive["name"],
            $primitive["cuitCuil"],
            $primitive["address"],
            $primitive["city"],
            $primitive["province"],
            $primitive["email"],
            $primitive["phone"],
            $primitive["createdAt"],
            $primitive["createdBy"],
            $primitive["modifiedBy"],
            $primitive["deleted"]
        );
    }
}