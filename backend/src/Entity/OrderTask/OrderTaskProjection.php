<?php
namespace Src\Entity\OrderTask;

final readonly class OrderTaskProjection
{

    function __construct(
            private int $id,
            private int $idOrder,
            private string $state,
            private string $sectorName,
            private string $taskDescription,
            private string $note,
    ){
    }
    
    public function idOrder(): int
    {
        return $this->idOrder;
    }

    public function state(): string
    {
        return $this->state;
    }

    public function sectorName(): string
    {
        return $this->sectorName;
    }

    public function taskDescription(): string
    {
        return $this->taskDescription;
    }

    public function note(): string
    {
        return $this->note;
    }
    
        public function id(): int
        {
            return $this->id;
        }
}