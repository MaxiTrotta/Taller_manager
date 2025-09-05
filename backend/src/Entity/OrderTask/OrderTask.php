<?php
//BORRAR ENTIDAD Y CREAR ORDERS_TASKS MANTENIENDO LOS ATRIBUTOS 
namespace Src\Entity\OrderTask;

use DateTime;
use src\Entity\Sector\Sector;
use src\Entity\Task\Task;
use src\Entity\Order\Order;

final class OrderTask{

    function __construct(
        private readonly ?int $id,
        private Order $idOrder,
        private DateTime $date,
        private string $state,
        private string $createdBy,
        private string $assignedTo,
        private sector $idSector,
        private Task $idTask
    ){
    }

        public function id(): ?int
        {
            return $this->id;
        }
    
        public function idOrder(): ?int
        {
            return $this->idOrder->id();
        }

        public function date(): DateTime
        {
            return $this->date;
        }
    
        public function state(): string
        {
            return $this->state;
        }
    
        public function createdBy(): string
        {
            return $this->createdBy;
        }
    
        public function assignedTo(): string
        {
            return $this->assignedTo;
        }
    
        public function idSector(): ?int
        {
            return $this->idSector->id();
        }
    
        public function idTask(): ?int
        {
            return $this->idTask->id();
        }

        
    public static function create(
        ?int $id,
        ?Order $idOrder,
        DateTime $date,
        string $state,
        string $createdBy,
        string $assignedTo,
        ?sector $idSector,
        ?Task $idTask
    ):self {
        return new self(
            null,
            null,
            $date,
            $state,
            $createdBy,
            $assignedTo,
            null,
            null
        );
    }


}