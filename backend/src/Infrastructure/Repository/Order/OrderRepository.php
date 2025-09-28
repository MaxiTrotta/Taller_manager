<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Order;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Order\Order;

final readonly class OrderRepository extends PDOManager implements OrderRepositoryInterface {

    public function find(int $id): ?Order 
    {
        $query = "SELECT * FROM order_base WHERE id = :id AND deleted = 0";

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToOrder($result[0] ?? null);
    }

    public function search(): array
    {
        $query = "SELECT * FROM order_base WHERE deleted = 0";
        $results = $this->execute($query);

        $orderResults = [];
        foreach ($results as $result) {
            $orderResults[] = $this->primitiveToOrder($result);
        }

        return $orderResults;
    }

    public function insert(Order $order): void
    {
        $query = <<<INSERT_QUERY
                    INSERT INTO order_base (name, idClient, deleted) VALUES (:name, :idClient, :deleted)
                INSERT_QUERY;

        $parameters = [
            "name" => $order->name(),
            "idClient" => $order->idClient(),
            "deleted" => $order->isDeleted()
        ];

        $this->execute($query, $parameters);
    }

    public function update(Order $order): void
    {
        $query = <<<UPDATE_QUERY
                        UPDATE
                            order_base
                        SET
                            name = :name,
                            idClient = :idClient,
                            deleted = :deleted
                        WHERE
                            id = :id
                    UPDATE_QUERY;

        $parameters = [
            "name" => $order->name(),
            "idClient" => $order->idClient(),
            "deleted" => $order->isDeleted(),
            "id" => $order->id()
        ];

        $this->execute($query, $parameters);
    }

    private function primitiveToOrder(?array $primitive): ?Order
    {
        if ($primitive === null) {
            return null;
        }

        return new Order(
            (int)$primitive["id"],
            (string)$primitive["name"],
            (int)$primitive["idClient"],
            (bool)$primitive["deleted"]
        );
    }
}