<?php 

final readonly class VehicleRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "vehicle_get",
        "url" => "/vehicles",
        "controller" => "Vehicle/VehicleGetController.php",
        "method" => "GET",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "vehicles_get",
        "url" => "/vehicles",
        "controller" => "Vehicle/VehiclesGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "vehicle_post",
        "url" => "/vehicles",
        "controller" => "Vehicle/VehiclePostController.php",
        "method" => "POST"
      ],
      [
        "name" => "vehicle_put",
        "url" => "/vehicles",
        "controller" => "Vehicle/VehiclePutController.php",
        "method" => "PUT",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "vehicle_delete",
        "url" => "/vehicles",
        "controller" => "Vehicle/VehicleDeleteController.php",
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
