<?php 

final readonly class BudgetRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "budget_get",
        "url" => "/budgets",
        "controller" => "Budget/BudgetGetController.php",
        "method" => "GET",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "budgets_get",
        "url" => "/budgets",
        "controller" => "Budget/BudgetsGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "budget_post",
        "url" => "/budgets",
        "controller" => "Budget/BudgetPostController.php",
        "method" => "POST"
      ],
      [
        "name" => "budget_put",
        "url" => "/budgets",
        "controller" => "Budget/BudgetPutController.php",
        "method" => "PUT",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "budget_delete",
        "url" => "/budgets",
        "controller" => "Budget/BudgetDeleteController.php",
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
