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
                        INSERT INTO client ( name, cuitCuil, address, city, province, email, phone, deleted)
                        VALUES (:name, :cuitCuil, :address, :city, :province, :email, :phone, :deleted)
                    INSERT_QUERY;

        $parameters = [
            "name" => $client->name(),
            "cuitCuil" => $client->cuitCuil(),
            "address" => $client->address(),
            "city" => $client->city(),
            "province" => $client->province(),
            "email" => $client->email(),
            "phone" => $client->phone(),
            //"createdAt" => $client->createdAt(),
            // "createdBy" => $client->createdBy(),
            // "modifiedBy" => $client->modifiedBy(),
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
                        name = :name,
                        cuitCuil = :cuitCuil,
                        address = :address,
                        city = :city,
                        province = :province,
                        email = :email,
                        phone = :phone,
                        deleted = :deleted
                    WHERE
                        id = :id
                UPDATE_CATEGORY;
        
        $parameters = [
            "name" => $client->name(),
            "cuitCuil" => $client->cuitCuil(),
            "address" => $client->address(),
            "city" => $client->city(),
            "province" => $client->province(),
            "email" => $client->email(),
            "phone" => $client->phone(),
            //"createdAt" => $client->createdAt(),
            // "createdBy" => $client->createdBy(),
            // "modifiedBy" => $client->modifiedBy(),
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
            (int)$primitive["id"],
            (string)$primitive["name"],
            (string)$primitive["cuitCuil"],
            (string)$primitive["address"],
            (string)$primitive["city"],
            (string)$primitive["province"],
            (string)$primitive["email"],
            (string)$primitive["phone"],
            // new \DateTime($primitive["createdAt"]),
            // $primitive["createdBy"],
            // $primitive["modifiedBy"],
            (bool)$primitive["deleted"]
        );
    }
}