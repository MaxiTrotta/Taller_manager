<?php 

final readonly class OrderRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "order_get",
        "url" => "/orders",
        "controller" => "Order/OrderGetController.php",
        "method" => "GET",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "orders_get",
        "url" => "/orders",
        "controller" => "Order/OrdersGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "order_post",
        "url" => "/orders",
        "controller" => "Order/OrderPostController.php",
        "method" => "POST"
      ],
      [
        "name" => "order_put",
        "url" => "/orders",
        "controller" => "Order/OrderPutController.php",
        "method" => "PUT",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "order_delete",
        "url" => "/orders",
        "controller" => "Order/OrderDeleteController.php",
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
