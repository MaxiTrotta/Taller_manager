<?php

namespace src\Entity\Sector;

class Sector
{
    public function __construct(
        private ?int $id,
        private string $name,
        private bool $deleted
    ){

    }

    public static function create(
        string $name
    ):self {
        return new self(
            null,
            $name,
            false
        );
    }

    public function modify(
        string $name
    ):void{
        $this->name = $name;
    }

    public function id():int
    {
        return $this->id;
    }

}