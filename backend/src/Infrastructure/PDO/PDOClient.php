<?php 

namespace Src\Infrastructure\PDO;

use PDO;
use PDOException;

final class PDOClient {

    /** @var PDO[] $activeClients */
    private static array $activeClients = [];

    public function connect(): PDO
    {
        // Railway env vars
        $host = $_ENV['MYSQLHOST'];
        $port = $_ENV['MYSQLPORT'];
        $db   = $_ENV['MYSQLDATABASE'];
        $user = $_ENV['MYSQLUSER'];
        $pass = $_ENV['MYSQLPASSWORD'];

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

        try {
            $conn = new PDO(
                $dsn,
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );

            return $conn;
        } catch (PDOException $e) {
            echo "Hubo un error en la base de datos: " . $e->getMessage();
            exit();
        }
    }
}
