<?php 

final readonly class EmployedRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "employed_get",
        "url" => "/employees",
        "controller" => "Employed/EmployedGetController.php",
        "method" => "GET",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "employees_get",
        "url" => "/employees",
        "controller" => "Employed/EmployeesGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "employed_post",
        "url" => "/employees",
        "controller" => "Employed/EmployedPostController.php",
        "method" => "POST"
      ],
      [
        "name" => "employed_put",
        "url" => "/employees",
        "controller" => "Employed/EmployedPutController.php",
        "method" => "PUT",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "employed_delete",
        "url" => "/employees",
        "controller" => "Employed/EmployedDeleteController.php",
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
