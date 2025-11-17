<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');

// Validacion para externos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si el metodo es OPTIONS (El cliente envia un OPTIONS antes de mandar el metodo real para verificar si el SV funciona)
// Solo manda OPTIONS si el cliente quiere mandar un GET, POST, PUT, DELETE, PATCH, OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
    // Si el cliente pide el allow methods, devolvemos los allow methods
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
    
    // Si el cliente pide las cabeceras, devolvemos las cabeceras
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Cargamos configuración de composer
require_once __DIR__.'/vendor/autoload.php';
require_once __DIR__.'/app/Router/Routes.php';
require_once __DIR__.'/app/Autoloader/Autoloader.php';


// Utilizamos la libreria 'Dotenv' para cargar nuestros datos
$dotenv = Dotenv\Dotenv::createUnsafeImmutable(__DIR__);
$dotenv->safeLoad();  // NO pisa las variables de Railway


// Cargamos el autoloader
spl_autoload_register(
    function ($class): void {
        Autoloader::register($class, [
            "src/Service",
            "src/Entity",
            "src/Infrastructure",
            "src/Utils",
            "src/Middleware"
        ]);
    }
);

// Cargamos el routeador
$router = startRouter();

// Obtenemos el URL de donde esta entrando el usuario
$url = $_SERVER["REQUEST_URI"];

$url = explode("?", $url)[0];

try {
    // A partir del URL y del metodo, el Routeador decide por que ruta entrar
    $router->resolve(
        $url,
        $_SERVER['REQUEST_METHOD']
    );
} catch (Exception $e) {   
    $status = 404;

    if ($e->getMessage() == "El usuario no se encuentra autorizado.") {
        $status = 401;
    }

    // Si la ruta no existe, devolvemos un error 404
    header("HTTP/1.0 $status Not Found");
    echo json_encode([
        "status" => $status,
        "message"=> $e->getMessage()
    ]);
}
