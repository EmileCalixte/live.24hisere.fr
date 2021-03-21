<?php


namespace App\Database;


class DAO
{
    private \PDO $database;

    public function __construct(string $host, string $dbName, string $user, string $password)
    {
        try {
            $this->database = new \PDO("mysql:host={$host};dbname={$dbName};charset=utf8", $user, $password);
        } catch (\Exception $e) {
            throw new \RuntimeException("Unable to connect to database: {$e->getMessage()}", $e->getCode(), $e);
        }
    }

    /** TODO database interaction functions */
}
