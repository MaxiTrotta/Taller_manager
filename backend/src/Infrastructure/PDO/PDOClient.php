<?php 

namespace Src\Infrastructure\PDO;

use PDO;
use PDOException;

final class PDOClient {

    /** @var PDO[] $activeClients */
    private static array $activeClients = [];

    public function connect(): PDO
    {
        $client = $this->client();

        if ($client === null) {
            $client = $this->connectClient();
        }

        return $client;
    }

    private function client(): ?PDO
    {
        return self::$activeClients[$_ENV['MYSQLUSER']] ?? null;
    }


    private function connectClient(): PDO
    {
        try {

            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s',
                $_ENV['MYSQLHOST'],
                $_ENV['MYSQLPORT'],
                $_ENV['MYSQLDATABASE']
            );

            $conn = new PDO(
                $dsn,
                $_ENV['MYSQLUSER'],
                $_ENV['MYSQLPASSWORD']
            );
            
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            self::$activeClients[$_ENV['MYSQLUSER']] = $conn;

            return $conn;

        } catch (PDOException $e) {
            echo "Hubo un error en la base de datos: " . $e->getMessage();
            exit();
        }
    }
}
