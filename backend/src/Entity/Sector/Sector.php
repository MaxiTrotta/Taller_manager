<?php

namespace src\Entity\Sector;

class Sector
{
    public function __construct(
        private int $id,
        private string $name
    ){

    }

    public static function create(
        int $id,
        string $name
    ):self {
        return new self(
            $id,
            $name
        );
    }

    public function modify(
        int $id,
        string $name
    ):void{
        $this->id = $id;
        $this->name = $name;
    }

}