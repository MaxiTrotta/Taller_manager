
<?php 

final readonly class ClientRoutes {
  public static function getRoutes(): array {
    return [
   [
        "name" => "clients_get",
        "url" => "/clients",
        "controller" => "Client/ClientsGetController.php",
        "method" => "GET"
      ],
    ];
  }
}