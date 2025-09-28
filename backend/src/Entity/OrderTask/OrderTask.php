<?php

namespace Src\Entity\OrderTask;

//use DateTime;

final class OrderTask{

    function __construct(
        private readonly ?int $id,
        private ?int $idOrder,
        //private ?DateTime $date,
        private string $state = "Pendiente",
        // private int $createdBy,
        // private string $assignedTo,
        private ?int $idSector,
        private ?int $idTask,
        private bool $deleted
        ){
        }
        public static function create(
            int $idOrder,
            //?DateTime $date,
            string $state,
            // int $createdBy,
            // string $assignedTo,
            int $idSector,
            int $idTask
        ):self {
            return new self(
                null,
                null,
                //$date,
                $state,
                //$createdBy,
                //$assignedTo,
                null,
                null,
                false
            );
        }


        public function modify(int $idOrder,/* DateTime $date,*/ string $state, /*int $createdBy, string $assignedTo,*/ int $id): void
        {
            $this->idOrder = $idOrder;
            //$this->date = $date;
            $this->state = $state;
            //$this->createdBy = $createdBy;
            //$this->assignedTo = $assignedTo;
            $this->id = $id;
        }
        public function delete(): void
        {
            $this->deleted = true;
        }

         public function isDeleted(): int
        {
            return $this->deleted ? 1 : 0;
        }
        
        public function id(): int
        {
            return $this->id;
        }
    
        public function idOrder(): int
        {
            return $this->idOrder;
        }

        // public function date(): ?DateTime
        // {
        //     return $this->date;
        // }
    
        public function state(): string
        {
            return $this->state;
        }
    
        // public function createdBy(): int
        // {
        //     return $this->createdBy;
        // }
    
        // public function assignedTo(): string
        // {
        //     return $this->assignedTo;
        // }
    
        public function idSector(): int
        {
            return $this->idSector;
        }
    
        public function idTask(): int
        {
            return $this->idTask;
        }

        


}