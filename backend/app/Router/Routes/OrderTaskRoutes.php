<?php 

final readonly class OrderTaskRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "ordertask_get",
        "url" => "/ordertasks",
        "controller" => "OrderTask/OrderTaskGetController.php",
        "method" => "GET",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "ordertasks_get",
        "url" => "/ordertasks",
        "controller" => "OrderTask/OrderTasksGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "ordertask_post",
        "url" => "/ordertasks",
        "controller" => "OrderTask/OrderTaskPostController.php",
        "method" => "POST"
      ],
      [
        "name" => "ordertask_put",
        "url" => "/ordertasks",
        "controller" => "OrderTask/OrderTaskPutController.php",
        "method" => "PUT",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "ordertask_delete",
        "url" => "/ordertasks",
        "controller" => "OrderTask/OrderTaskDeleteController.php",
        "method" => "DELETE",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ]
    ];
  }
}
