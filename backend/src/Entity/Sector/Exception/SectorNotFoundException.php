<?php 

namespace Src\Entity\Sector\Exception;

use Exception;

final class SectorNotFoundException extends Exception {
    public function __construct(int $id) {
        parent::__construct('No se encontro el sector con id: '.$id);
    }
}