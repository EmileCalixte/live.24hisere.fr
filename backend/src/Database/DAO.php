<?php


namespace App\Database;


use App\Base\Singleton\Singleton;
use App\Database\Exception\DatabaseException;
use App\Misc\Util\DateUtil;
use PDO;

class DAO extends Singleton
{
    const TABLE_MISC = 'misc';
    const TABLE_PASSAGE = 'passage';
    const TABLE_RUNNER = 'runner';

    private ?PDO $database = null;

    public function initialize(string $host, string $dbName, string $user, string $password)
    {
        try {
            $this->database = new PDO("mysql:host={$host};dbname={$dbName};charset=utf8", $user, $password);
        } catch (\Exception $e) {
            throw new DatabaseException("Unable to connect to database: {$e->getMessage()}", $e->getCode(), $e);
        }
    }

    public function getDatabase(): PDO
    {
        if (is_null($this->database)) {
            throw new DatabaseException("The database connection has not been initialized");
        }

        return $this->database;
    }

    public function beginTransaction(): bool
    {
        return $this->database->beginTransaction();
    }

    public function commitTransaction(): bool
    {
        return $this->database->commit();
    }

    public function rollBackTransaction(): bool
    {
        return $this->database->rollBack();
    }

    public function getRaceData(bool $includeLastUpdateTime): array
    {
        $query = $this->getDatabase()->prepare('SELECT * FROM ' . self::TABLE_MISC);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        $raceData = [];

        foreach ($result as $row) {
            $key = $row['key'];
            $value = $row['value'];
            $raceData[$key] = $value;
        }

        if (!$includeLastUpdateTime) {
            unset($raceData['last_update_time']);
        }

        if (isset($raceData['first_lap_distance'])) {
            $raceData['first_lap_distance'] = (float) $raceData['first_lap_distance'];
        }

        if (isset($raceData['lap_distance'])) {
            $raceData['lap_distance'] = (float) $raceData['lap_distance'];
        }

        if (isset($raceData['last_update_time'])) {
            $raceData['last_update_time'] = DateUtil::convertDatabaseDateToJavascriptDate($raceData['last_update_time'], false);
        }

        if (isset($raceData['race_start_time'])) {
            $raceData['race_start_time'] = DateUtil::convertDatabaseDateToJavascriptDate($raceData['race_start_time'], false);
        }

        return $raceData;
    }

    public function setLastUpdateTime(\DateTimeInterface $dateTime): false|int
    {
        $dateTimeString = $dateTime->format('Y-m-d H:i:s');

        return $this->getDatabase()->exec('REPLACE INTO ' . self::TABLE_MISC . " (`key`, `value`) VALUES ('last_update_time', '$dateTimeString')");
    }
}
