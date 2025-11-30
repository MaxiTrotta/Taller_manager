<?php 

final readonly class DashboardRoutes {
  public static function getRoutes(): array {
    return [
      [
        "name" => "dashboard_tasks_get",
        "url" => "/dashboard/tasks-performed",
        "controller" => "Dashboard/DashboardTasksGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "dashboard_sectors_get",
        "url" => "/dashboard/sector-stats",
        "controller" => "Dashboard/DashboardSectorsGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "dashboard_orders_per_day_get",
        "url" => "/dashboard/orders-per-day",
        "controller" => "Dashboard/DashboardOrdersPerDayGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "dashboard_status_get",
        "url" => "/dashboard/orders-status",
        "controller" => "Dashboard/DashboardStatusGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "dashboard_clients_get",
        "url" => "/dashboard/top-clients",
        "controller" => "Dashboard/DashboardClientsGetController.php",
        "method" => "GET"
      ],
      [
        "name" => "dashboard_summary_get",
        "url" => "/dashboard/summary",
        "controller" => "Dashboard/DashboardSummaryGetController.php",
        "method" => "GET"
      ]
    ];
  }
}
