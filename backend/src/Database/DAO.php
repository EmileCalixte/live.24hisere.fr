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

        if (isset($metadata['first_lap_distance'])) {
            $metadata['first_lap_distance'] = (float) $metadata['first_lap_distance'];
        }

        if (isset($metadata['lap_distance'])) {
            $metadata['lap_distance'] = (float) $metadata['lap_distance'];
        }

        if (isset($metadata['last_update_time'])) {
            $metadata['last_update_time'] = Util::convertDatabaseDateToJavascriptDate($metadata['last_update_time'], false);
        }

        if (isset($metadata['race_start_time'])) {
            $metadata['race_start_time'] = Util::convertDatabaseDateToJavascriptDate($metadata['race_start_time'], false);
        }

        return $metadata;
    }

    public function getRanking(string $at = null)
    {
        $toBind = [];

        $passageTableName = self::TABLE_PASSAGE;
        $runnerTableName = self::TABLE_RUNNER;

        $stmt = <<<EOF
            SELECT 
                r.*, 
                count(p.id) AS passage_count,
                (
                    SELECT p1.time
                    FROM 
                        $passageTableName p1 
                    WHERE 
                        p1.runner_id = r.id 
        EOF;

        if (!is_null($at)) {
            $stmt .= ' AND p1.time <= :at';
        }

        $stmt .= " AND p1.id = (SELECT p2.id FROM $passageTableName p2 WHERE p2.runner_id = p1.runner_id";

        if (!is_null($at)) {
            $stmt .= ' AND p2.time <= :at';
        }

        $stmt .= <<<EOF
             ORDER BY p2.time DESC LIMIT 1)
                ) AS last_passage_time
            FROM 
                $runnerTableName r 
            LEFT JOIN 
                $passageTableName p ON p.runner_id = r.id 
        EOF;

        if (!is_null($at)) {
            $stmt .= ' AND p.time <= :at';
            $toBind[':at'] = $at;
        }

        $stmt .= <<<EOF
             GROUP BY r.id 
            ORDER BY passage_count DESC, last_passage_time ASC, lastname ASC, firstname ASC
        EOF;

        $query = $this->database->prepare($stmt);
        foreach (array_keys($toBind) as $param) {
            $query->bindParam($param, $toBind[$param]);
        }
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        for ($i = 0; $i < count($result); ++$i) {
            $row = &$result[$i];
            if (!is_null($row['last_passage_time'])) {
                $row['last_passage_time'] = Util::convertDatabaseDateToJavascriptDate($row['last_passage_time']);
            }

            $row['is_team'] = $row['is_team'] === '1';
        }

        return $result;
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
