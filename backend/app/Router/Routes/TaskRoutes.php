<?php 

final readonly class TaskRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "task_get",
        "url" => "/tasks",
        "controller" => "Task/TaskGetController.php",
        "method" => "GET",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "tasks_get",
        "url" => "/tasks",
        "controller" => "Task/TasksGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "task_post",
        "url" => "/tasks",
        "controller" => "Task/TaskPostController.php",
        "method" => "POST"
      ],
      [
        "name" => "task_put",
        "url" => "/tasks",
        "controller" => "Task/TaskPutController.php",
        "method" => "PUT",
        "parameters" => [
          [
            "name" => "id",
            "type" => "int"
          ]
        ]
      ],
      [
        "name" => "task_delete",
        "url" => "/tasks",
        "controller" => "Task/TaskDeleteController.php",
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
