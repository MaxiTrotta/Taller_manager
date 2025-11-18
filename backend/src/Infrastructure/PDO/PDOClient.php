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
        $username = $this->env('MYSQLUSER') ?? $this->env('DATABASE_USER');
        return self::$activeClients[$username] ?? null;
    }


    private function connectClient(): PDO
    {
        // Railway first, local fallback
        $host = $this->env('MYSQLHOST')       ?? $this->env('DATABASE_HOST');
        $port = $this->env('MYSQLPORT')       ?? $this->env('DATABASE_PORT');
        $db   = $this->env('MYSQLDATABASE')   ?? $this->env('DATABASE_NAME');
        $user = $this->env('MYSQLUSER')       ?? $this->env('DATABASE_USER');
        $pass = $this->env('MYSQLPASSWORD')   ?? $this->env('DATABASE_PASSWORD');

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

        try {
            $conn = new PDO(
                $dsn,
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );

            self::$activeClients[$user] = $conn;
            return $conn;

        } catch (PDOException $e) {
            echo "Hubo un error en la base de datos: " . $e->getMessage();
            exit();
        }
    }

    private function env(string $key): ?string
    {
        return $_ENV[$key] ?? $_SERVER[$key] ?? null;
    }
}
