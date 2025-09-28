<?php

use Src\Service\User\UserTokenValidatorService;
use Src\Utils\ControllerUtils;
use Src\Service\OrderTask\OrderTaskCreatorService;

final readonly class OrderTaskPostController {
    private OrderTaskCreatorService $service;
    private UserTokenValidatorService $userTokenValidatorService;

    public function __construct() {
        $this->service = new OrderTaskCreatorService();
        $this->userTokenValidatorService = new UserTokenValidatorService();
    }

    public function start(): void
    {
        $idOrder = ControllerUtils::getPost("idOrder");
        //$date = ControllerUtils::getPost("date", false);
        $state = ControllerUtils::getPost("state");
        //$assignedTo = ControllerUtils::getPost("assignedTo");
        $idSector = ControllerUtils::getPost("idSector");
        $idTask = ControllerUtils::getPost("idTask");

        // if ($date !== null) {
        //     $date = new DateTime($date);
        // }

        // $userToken = ControllerUtils::getHeaderToken();//recupera el token del usuario activo
        // $createdBy = $this->userTokenValidatorService->validate($userToken);//trae el usuario asociado al token

        $this->service->create(
            $idOrder,
            //$date,
            $state,
            //$createdBy->id(),
            //$assignedTo,
            $idSector,
            $idTask
        );
    }
}