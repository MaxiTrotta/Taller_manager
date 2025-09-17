<?php 

namespace Src\Entity\Task\Exception;

use Exception;

final class TaskNotFoundException extends Exception {
    public function __construct(int $id) {
        parent::__construct('No se encontro la tarea con id: '.$id);
    }
}