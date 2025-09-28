<?php
namespace Src\Entity\OrderTask;

final readonly class OrderTaskInformation
{

    function __construct(
        private int $idOrder,
        private string $sectorName,
        private string $loquequieras
    ){
    }
    
    public function idOrder(): int
    {
        return $this->idOrder;
    }
}