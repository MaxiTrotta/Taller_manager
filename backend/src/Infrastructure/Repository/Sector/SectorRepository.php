<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Sector;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Sector\Sector;

final readonly class SectorRepository extends PDOManager implements SectorRepositoryInterface {

    public function find(int $id): ?Sector 
    {
        $query = <<<HEREDOC
                        SELECT * 
                        FROM sector
                        WHERE id = :id AND deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToSector($result[0] ?? null);
    }

    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT * 
                        FROM sector 
                        WHERE deleted = 0
                    HEREDOC;

        $results = $this->execute($query);

        $sectorResults = [];
        foreach ($results as $result) {
            $sectorResults[] = $this->primitiveToSector($result);
        }

        return $sectorResults;
    }

    public function insert(Sector $sector): void
    {
        $query = "INSERT INTO sector (name, deleted) VALUES (:name, :deleted) ";

        $parameters = [
            "name" => $sector->name(),
            "deleted" => $sector->isDeleted()
        ];

        $this->execute($query, $parameters);
    }

    public function update(Sector $sector): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            sector
                        SET
                            name = :name,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "name" => $sector->name(),
            "deleted" => $sector->isDeleted(),
            "id" => $sector->id()
        ];

        $this->execute($query, $parameters);
    }

    private function primitiveToSector(?array $primitive): ?Sector
    {
        if ($primitive === null) {
            return null;
        }

        return new Sector(
            (int)$primitive["id"],
            (string)$primitive["name"],
            (bool)$primitive["deleted"]
        );
    }
}