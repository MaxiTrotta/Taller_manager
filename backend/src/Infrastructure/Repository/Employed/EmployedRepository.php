<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Employed;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Employed\Employed;
use Src\Entity\Employed\EmployeeProjection;

final readonly class EmployedRepository extends PDOManager implements EmployedRepositoryInterface {

    public function find(int $id): ?EmployeeProjection 
    {
        $query = <<<HEREDOC
                        SELECT 
                            E.*,
                            S.name AS sectorName
                        FROM
                            employed E
                        INNER JOIN 
                            sector S ON E.idSector = S.id
                        WHERE
                            E.id = :id AND E.deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToEmployeeProjection($result[0] ?? null);
    }

    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT 
                            E.*,
                            S.name AS sectorName
                        FROM
                            employed E
                        INNER JOIN 
                            sector S ON E.idSector = S.id
                        WHERE
                            E.deleted = 0
                    HEREDOC;

        $results = $this->execute($query);

        $employedResults = [];
        foreach ($results as $result) {
            $employedResults[] = $this->primitiveToEmployeeProjection($result);
        }

        return $employedResults;
    }

    public function insert(Employed $employed): void
    {
        $query = <<<INSERT_QUERY
                        INSERT INTO employed (idSector, name, cuilCuit, phone, email, address, deleted)
                        VALUES (:idSector, :name, :cuilCuit, :phone, :email, :address, :deleted)
                    INSERT_QUERY;

        $parameters = [
            "idSector" => $employed->idSector(),
            "name" => $employed->name(),
            "cuilCuit" => $employed->cuilCuit(),
            "phone" => $employed->phone(),
            "email" => $employed->email(),
            "address" => $employed->address(),
            "deleted" => $employed->isDeleted()
        ];

        $this->execute($query, $parameters);
    }

    public function update(Employed $employed): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            employed
                        SET
                            idSector = :idSector,
                            name = :name,
                            cuilCuit = :cuilCuit,
                            phone = :phone,
                            email = :email,
                            address = :address,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "idSector" => $employed->idSector(),
            "name" => $employed->name(),
            "cuilCuit" => $employed->cuilCuit(),
            "phone" => $employed->phone(),
            "email" => $employed->email(),
            "address" => $employed->address(),
            "deleted" => $employed->isDeleted(),
            "id" => $employed->id()
        ];

        $this->execute($query, $parameters);
    }

    private function primitiveToEmployed(?array $primitive): ?Employed
    {
        if ($primitive === null) {
            return null;
        }

        return new Employed(

            (int)$primitive["id"],
            (int)$primitive["idSector"],
            (string)$primitive["name"],
            (string)$primitive["cuilCuit"],
            (string)$primitive["phone"],
            (string)$primitive["email"],
            (string)$primitive["address"],

            (bool)$primitive["deleted"]
        );
    }

    private function primitiveToEmployeeProjection(?array $primitive): ?EmployeeProjection
    {
        if ($primitive === null) {
            return null;
        }

        return new EmployeeProjection(
            (int) $primitive["id"],
            (int) $primitive["idSector"],
            $primitive["sectorName"],
            $primitive["name"],
            $primitive["cuilCuit"],
            $primitive["phone"],
            $primitive["email"],
            $primitive["address"],
        );
    }
}