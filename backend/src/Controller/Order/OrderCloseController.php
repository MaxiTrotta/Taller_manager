<?php

use Src\Utils\ControllerUtils;
use Src\Infrastructure\Repository\Order\OrderRepository;
use Src\Service\OrderTask\OrderTasksSearcherService;

final readonly class OrderCloseController {
    private OrderRepository $repository;

    public function __construct() {
        $this->repository = new OrderRepository();
    }

    public function start(int $id): void
    {
        $modifiedBy = ControllerUtils::getPost('modifiedBy', false, null);

        // ensure order exists and is in finalizado (state === 3)
        $projection = $this->repository->findProjection($id);
        if ($projection === null) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'error' => 'Order not found']);
            return;
        }

        // load order tasks so the projection can compute the correct state
        $orderTasksService = new OrderTasksSearcherService();
        $tasks = $orderTasksService->searchProjections($id);
        $projection->setOrderTaskProjection($tasks);

        $currentState = $projection->getOrderTaskState();
        if ($currentState !== 3) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Order must be Finalizado before closing']);
            return;
        }

        $this->repository->markClosed($id, $modifiedBy);
        echo json_encode(['ok' => true]);
    }
}

