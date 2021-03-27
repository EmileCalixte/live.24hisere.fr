<?php


namespace App\Database;


use App\Misc\Util;
use PDO;

class DAO
{
    const TABLE_MISC = 'misc';
    const TABLE_PASSAGE = 'passage';
    const TABLE_RUNNER = 'runner';

    private PDO $database;

    public function __construct(string $host, string $dbName, string $user, string $password)
    {
        try {
            $this->database = new PDO("mysql:host={$host};dbname={$dbName};charset=utf8", $user, $password);
        } catch (\Exception $e) {
            throw new \RuntimeException("Unable to connect to database: {$e->getMessage()}", $e->getCode(), $e);
        }
    }

    public function getCategories(): array
    {
        $query = $this->database->query('SELECT DISTINCT category from ' . self::TABLE_RUNNER);

        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($fetch) {
            return $fetch['category'];
        }, $result);
    }

    public function getMetadata(): array
    {
        $query = $this->database->prepare('SELECT * FROM ' . self::TABLE_MISC);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        $metadata = [];

        foreach ($result as $row) {
            $key = $row['key'];
            $value = $row['value'];
            $metadata[$key] = $value;
        }

        if (isset($metadata['last_update_time'])) {
            $metadata['last_update_time'] = Util::convertDatabaseDateToJavascriptDate($metadata['last_update_time'], false);
        }

        return $metadata;
    }

    public function getRunner(int|string $id): array
    {
        $query = $this->database->prepare('SELECT * FROM ' . self::TABLE_RUNNER . ' WHERE id = :id');
        $query->bindParam(':id', $id);
        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getRunnerPassages(int|string $runnerId): array
    {
        $query = $this->database->prepare('SELECT id, time FROM ' . self::TABLE_PASSAGE . ' WHERE runner_id = :runnerId ORDER BY time ASC');
        $query->bindParam(':runnerId', $runnerId);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        for ($i = 0; $i < count($result); ++$i) {
            $row = &$result[$i];
            $row['time'] = Util::convertDatabaseDateToJavascriptDate($row['time']);
        }

        return $result;
    }

    public function getRunners(): array
    {
        $query = $this->database->prepare('SELECT * FROM ' . self::TABLE_RUNNER);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
}
