<?php 

namespace Src\Entity\Budget;

final class BudgetProjection {

    public function __construct(
        private readonly int $id,
        private readonly string $client,
        private readonly string $description,
        private readonly float $total_amount,
        /** @var array<int, array{description:string,price:float}> */
        private readonly array $lines = []
    ) {
    }

    public function id(): int
    {
        return $this->id;
    }

    public function client(): string
    {
        return $this->client;
    }

    public function description(): string
    {
        return $this->description;
    }

    /**
     * Devuelve las líneas del presupuesto como un arreglo de objetos con keys
     * 'description' y 'price'. Por defecto devuelve [] si no hay líneas.
     *
     * @return array<int, array{description:string,price:float}>
     */
    public function lines(): array
    {
        return $this->lines;
    }

    public function total_amount(): float
    {
        return $this->total_amount;
    }
}