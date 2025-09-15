<?php 

namespace Src\Entity\OrderTask\Exception;

use Exception;

final class OrderTaskNotFoundException extends Exception {
    public function __construct(int $id) {
        parent::__construct('No se encontro la tarea del pedido con id: '.$id);
    }
}