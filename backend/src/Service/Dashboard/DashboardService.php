<?php

declare(strict_types = 1);

namespace Src\Service\Dashboard;

use Src\Infrastructure\Repository\Dashboard\DashboardRepository;

final readonly class DashboardService {
    private DashboardRepository $repository;

    public function __construct() {
        $this->repository = new DashboardRepository();
    }

    public function getMostPerformedTasks(int $limit = 5): array
    {
        return $this->repository->getMostPerformedTasks($limit);
    }

    public function getSectorStats(): array
    {
        return $this->repository->getSectorStats();
    }

    public function getOrdersPerDay(int $days = 30): array
    {
        return $this->repository->getOrdersPerDay($days);
    }

    public function getOrdersStatus(): array
    {
        return $this->repository->getOrdersStatus();
    }

    public function getTopClients(int $limit = 10): array
    {
        return $this->repository->getTopClients($limit);
    }

    public function getSummary(): array
    {
        return $this->repository->getSummary();
    }
}
