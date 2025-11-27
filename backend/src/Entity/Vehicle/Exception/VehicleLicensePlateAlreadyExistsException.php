<?php 

namespace Src\Entity\Vehicle\Exception;

use Exception;

final class VehicleLicensePlateAlreadyExistsException extends Exception {
    public function __construct(string $licensePlate) {
        parent::__construct('La patente ' . $licensePlate . ' ya se encuentra registrada.');
    }
}

