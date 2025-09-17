<?php 

final readonly class SectorRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "sector_get",
        "url" => "/sectors",
        "controller" => "Sector/SectorGetController.php",
        "method" => "GET",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "sectors_get",
        "url" => "/sectors",
        "controller" => "Sector/SectorsGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "sector_post",
        "url" => "/sectors",
        "controller" => "Sector/SectorPostController.php",
        "method" => "POST"
      ],
      [
        "name" => "sector_put",
        "url" => "/sectors",
        "controller" => "Sector/SectorPutController.php",
        "method" => "PUT",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "sector_delete",
        "url" => "/sectors",
        "controller" => "Sector/SectorDeleteController.php",
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
