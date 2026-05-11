<?php

declare(strict_types=1);

namespace Src\Infrastructure\Repository\Budget;

use DateTime;
use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Budget\Budget;
use Src\Entity\Budget\BudgetProjection;
use Src\Infrastructure\Repository\Budget\BudgetLineRepository;

final readonly class BudgetRepository extends PDOManager implements BudgetRepositoryInterface
{

    public function find(int $id): ?Budget
    {
        $query = <<<HEREDOC
                        SELECT *
                        FROM budget B
                        WHERE B.id = :id AND B.deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);

        return $this->primitiveToBudget($result[0] ?? null);
    }
    public function findProjection(int $id): ?BudgetProjection
    {
        $query = <<<HEREDOC
            SELECT 
                b.id AS idBudget,
                c.name AS clientName,
                b.description AS description,
                b.total_amount AS total_amount
            FROM budget b
            INNER JOIN client c ON (c.id = b.idClient AND c.deleted = 0)
            WHERE
                b.deleted = 0 
                AND b.id = :id
        HEREDOC;

        $parameters = ["id" => $id];
        $result = $this->execute($query, $parameters);

        return $this->primitiveToBudgetProjection($result[0] ?? null);
    }

    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT 
                            B.*
                        FROM
                            budget B
                        WHERE
                            B.deleted = 0
                    HEREDOC;
        $results = $this->execute($query);

        $budgetResults = [];
        foreach ($results as $result) {
            $budgetResults[] = $this->primitiveToBudget($result);
        }

        return $budgetResults;
    }
    public function searchProjections(): array
    {
        $query = <<<HEREDOC
            SELECT 
                b.id AS idBudget,
                c.name AS clientName,
                b.description AS description,
                b.total_amount AS total_amount
            FROM budget b
            INNER JOIN client c ON (c.id = b.idClient AND c.deleted = 0)
            WHERE 
                b.deleted = 0 
            ORDER BY 
                b.id DESC

        HEREDOC;

        $results = $this->execute($query);

        $budgetProjectionResults = [];
        foreach ($results as $result) {
            $budgetProjectionResults[] = $this->primitiveToBudgetProjection($result);
        }

        return $budgetProjectionResults;
    }


    public function insert(Budget $budget): int
    {
        $query = <<<INSERT_QUERY
                    INSERT INTO budget (idClient, description, total_amount, deleted) VALUES (:idClient, :description, :total_amount, :deleted)
                INSERT_QUERY;

        $parameters = [
            "idClient" => $budget->idClient(),
            "description" => $budget->description(),
            "total_amount" => $budget->total_amount(),
            "deleted" => $budget->isDeleted()
        ];

        $this->execute($query, $parameters);

        return $this->getLastInsertId();
    }

    public function update(Budget $budget): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            budget
                        SET
                            idClient = :idClient,
                            description = :description,
                            total_amount = :total_amount,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "idClient" => $budget->idClient(),
            "description" => $budget->description(),
            "total_amount" => $budget->total_amount(),
            "deleted" => $budget->isDeleted(),
            "id" => $budget->id()
        ];

        $this->execute($query, $parameters);
    }

    private function primitiveToBudget(?array $primitive): ?Budget
    {
        if ($primitive === null) {
            return null;
        }

        return new Budget(
            (int) $primitive["id"],
            (int) $primitive["idClient"],
            (string) $primitive["description"],
            (float) $primitive["total_amount"],
            (bool) $primitive["deleted"]
        );
    }

    private function primitiveToBudgetProjection(?array $primitive): ?BudgetProjection
    {
        if ($primitive === null) {
            return null;
        }

        // Preferir leer líneas estructuradas desde la tabla budget_line si existe.
        $lines = [];
        try {
            $lineRepo = new BudgetLineRepository();
            $lines = $lineRepo->searchByBudget((int) $primitive["idBudget"]);
        } catch (\Throwable $e) {
            // Si por alguna razón no existe la tabla o falla, hacer fallback parseando description.
            $rawDescription = (string) ($primitive["description"] ?? "");
            if ($rawDescription !== "") {
                $parts = preg_split('/;\\s*/', $rawDescription);
                if ($parts === false) $parts = [$rawDescription];
                foreach ($parts as $p) {
                    $trim = trim($p);
                    if ($trim !== "") {
                        // Eliminar prefijos tipo "1) " si existen
                        $trim = preg_replace('/^\d+\)\s*/', '', $trim);
                        // intentar separar precio con ' - '
                        $desc = $trim;
                        $price = 0.0;
                        if (strpos($trim, ' - ') !== false) {
                            [$d, $pr] = explode(' - ', $trim, 2);
                            $desc = trim($d);
                            $pnum = floatval(str_replace([',', '$'], ['.', ''], $pr));
                            $price = $pnum;
                        }
                        $lines[] = ['description' => $desc, 'price' => $price];
                    }
                }
            }
        }

        return new BudgetProjection(
            (int) $primitive["idBudget"],
            (string) $primitive["clientName"],
            (string) $primitive["description"],
            (float) $primitive["total_amount"],
            $lines
        );
    }
}