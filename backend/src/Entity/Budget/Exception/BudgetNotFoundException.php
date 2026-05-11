<?php 

namespace Src\Entity\Budget\Exception;

use Exception;

final class BudgetNotFoundException extends Exception {
    public function __construct(int $id) {
        parent::__construct('No se encontro el presupuesto con id: '.$id);
    }
}