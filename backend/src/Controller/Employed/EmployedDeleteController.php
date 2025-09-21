<?php 

use Src\Service\Employed\EmployedDeleterService;

final readonly class EmployedDeleteController {
    private EmployedDeleterService $service;

    public function __construct() {
        $this->service = new EmployedDeleterService();
    }

    public function start(int $id): void
    {
        $this->service->delete($id);
    }
}