<?php 

namespace Src\Entity\Order\Exception;

use Exception;

final class OrderNotFoundException extends Exception {
    public function __construct(int $id) {
        parent::__construct('No se encontro el pedido con id: '.$id);
    }
}