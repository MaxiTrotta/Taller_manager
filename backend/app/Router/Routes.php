<?php 

include_once "Route.php";
include_once "Router.php";

function startRouter(): Router 
{
    $routes = [];

    include_once "Routes/DomainRoutes.php";
    $routes = array_merge($routes, DomainRoutes::getRoutes());

    include_once "Routes/OrderRoutes.php";
    $routes = array_merge($routes, OrderRoutes::getRoutes());

    include_once "Routes/UserRoutes.php";
    $routes = array_merge($routes, UserRoutes::getRoutes());

    include_once "Routes/FileRoutes.php";
    $routes = array_merge($routes, FileRoutes::getRoutes());

    include_once "Routes/TaskRoutes.php";
    $routes = array_merge($routes, TaskRoutes::getRoutes());

    include_once "Routes/SectorRoutes.php";
    $routes = array_merge($routes, SectorRoutes::getRoutes());

    include_once "Routes/ClientRoutes.php";
    $routes = array_merge($routes, ClientRoutes::getRoutes());
    $routesClass = [];

    foreach ($routes as $route) {
        $routesClass[] = Route::fromArray($route);
    }

    return new Router($routesClass);
}