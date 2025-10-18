<?php

namespace Src\Entity\OrderTask;

//use DateTime;

final class OrderTask{

    function __construct(
        private readonly ?int $id,
        private ?int $idOrder,
        //private ?DateTime $date,
        private ?string $state,
        // private int $createdBy,
        // private string $assignedTo,
        private ?int $idSector,
        private ?int $idTask,
        private ?string $note,
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
            int $idTask,
            string $note,
        ):self {
            return new self(
                null,
                $idOrder,
                //$date,
                $state,
                //$createdBy,
                //$assignedTo,
                $idSector,
                $idTask,
                $note,
                false
            );
        }


        public function modify(int $idOrder,/* DateTime $date,*/ string $state, /*int $createdBy, string $assignedTo,*/ int $idSector, int $idTask, string $note): void
        {
            $this->idOrder = $idOrder;
            //$this->date = $date;
            $this->state = $state;
            //$this->createdBy = $createdBy;
            //$this->assignedTo = $assignedTo;
            $this->idSector = $idSector;
            $this->idTask = $idTask;
            $this->note = $note;
        
        }
        public function delete(): void
        {
            $this->deleted = true;
        }

         public function isDeleted(): int
        {
            return $this->deleted ? 1 : 0;
        }
        
        public function id(): ?int
        {
            return $this->id;
        }
    
        public function idOrder(): ?int
        {
            return $this->idOrder;
        }

        // public function date(): ?DateTime
        // {
        //     return $this->date;
        // }
    
        public function state(): ?string
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
    
        public function idSector(): ?int
        {
            return $this->idSector;
        }

        public function idTask(): ?int
        {
            return $this->idTask;
        }

        public function note(): ?string
        {
            return $this->note;
        }
        

}