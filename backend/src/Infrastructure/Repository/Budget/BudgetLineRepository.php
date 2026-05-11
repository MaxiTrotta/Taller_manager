<?php

declare(strict_types=1);

namespace Src\Infrastructure\Repository\Budget;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Budget\BudgetLine;

final readonly class BudgetLineRepository extends PDOManager {

    public function insert(BudgetLine $line): void
    {
        $query = <<<SQL
            INSERT INTO budget_line (idBudget, description, price, deleted) VALUES (:idBudget, :description, :price, :deleted)
        SQL;

        $params = [
            'idBudget' => $line->idBudget(),
            'description' => $line->description(),
            'price' => $line->price(),
            'deleted' => $line->isDeleted()
        ];

        $this->execute($query, $params);
    }

    public function deleteByBudget(int $budgetId): void
    {
        $query = <<<SQL
            UPDATE budget_line
            SET deleted = 1
            WHERE idBudget = :idBudget
        SQL;

        $params = ['idBudget' => $budgetId];
        $this->execute($query, $params);
    }

    /** @return array{description:string,price:float}[] */
    public function searchByBudget(int $budgetId): array
    {
        $query = <<<SQL
            SELECT description, price
            FROM budget_line
            WHERE deleted = 0 AND idBudget = :idBudget
            ORDER BY id ASC
        SQL;

        $params = ['idBudget' => $budgetId];
        $results = $this->execute($query, $params);

        $lines = [];
        foreach ($results as $r) {
            $lines[] = [
                'description' => (string)($r['description'] ?? ''),
                'price' => (float)($r['price'] ?? 0),
            ];
        }

        return $lines;
    }
}
