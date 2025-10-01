<?php 

declare(strict_types = 1);

namespace Src\Infrastructure\Repository\Order;

use Src\Infrastructure\PDO\PDOManager;
use Src\Entity\Order\Order;

final readonly class OrderRepository extends PDOManager implements OrderRepositoryInterface {

    public function find(int $id): ?Order 
    {
        $query = <<<HEREDOC
                        SELECT T.description
                        FROM task T
                        JOIN orderTask OT ON T.id = OT.idTask
                        WHERE OT.idOrder = :id AND OT.deleted = 0
                    HEREDOC;

        $parameters = [
            "id" => $id
        ];

        $result = $this->execute($query, $parameters);
        
        return $this->primitiveToOrder($result[0] ?? null);
    }

    public function search(): array
    {
        $query = <<<HEREDOC
                        SELECT 
                            O.*,
                            T.description AS taskDescription
                        FROM
                            order_base O
                        INNER JOIN 
                            task T ON O.idOrderTask = T.id
                        WHERE
                            E.deleted = 0
                    HEREDOC;
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
            "idClient" => $order->idClient(),
            "idVehicle" => $order->idVehicle(),
            "idOrderTask" => $order->idOrderTask(),
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
            "idClient" => $order->idClient(),
            "idVehicle" => $order->idVehicle(),
            "idOrderTask" => $order->idOrderTask(),
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
            (int)$primitive["idClient"],
            (int)$primitive["idVehicle"],
            (int)$primitive["idOrderTask"],
            (bool)$primitive["deleted"]
        );
    }
}