<?php
//BORRAR ENTIDAD Y CREAR ORDERS_TASKS MANTENIENDO LOS ATRIBUTOS 
namespace Src\Entity\VehicleTasks;

use DateTime;
use src\Entity\Sector\Sector;

final class VehicleTasks{

    function __construct(
        private readonly ?int $id,
        private ?int $idVehicle,
        private string $name,
        private DateTime $date,
        private string $state,
        private string $createdBy,
        private string $assignedTo,
        private sector $idSector,
        private int $order//Cambiar por detalle
    ){
    }

        public function id(): ?int
        {
            return $this->id;
        }
    
        public function idVehicle(): ?int
        {
            return $this->idVehicle;
        }
    
        public function name(): string
        {
            return $this->name;
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
    
        public function idSector(): Sector
        {
            return $this->idSector;
        }
    
        public function order(): int
        {
            return $this->order;
        }



}