<?php 

namespace Src\Entity\Employed\Exception;

use Exception;

final class EmployedNotFoundException extends Exception {
    public function __construct(int $id) {
        parent::__construct('No se encontro el empleado con id: '.$id);
    }
}