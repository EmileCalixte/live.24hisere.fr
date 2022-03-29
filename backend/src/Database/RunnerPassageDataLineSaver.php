<?php

namespace App\Database;


use App\Model\PassagesFileDataLine\DataLine;

class RunnerPassageDataLineSaver
{
    private \PDO $database;

    private \PDOStatement $query;

    public function __construct()
    {
        $this->database = DAO::getInstance()->getDatabase();
        $this->query = $this->getDatabase()->prepare('INSERT INTO ' . DAO::TABLE_PASSAGE . ' (runner_id, time) VALUES (:runnerId, :time)');
    }

    public function saveDataLine(DataLine $dataLine): bool
    {
        $runnerId = $dataLine->getRunnerId();
        $passageTime = $dataLine->getPassageDateTime()->format('Y-m-d H:i:s');

        $this->getQuery()->bindParam(':runnerId', $runnerId);
        $this->getQuery()->bindParam(':time', $passageTime);
        return $this->getQuery()->execute();
    }

    private function getDatabase(): \PDO
    {
        return $this->database;
    }

    private function getQuery(): \PDOStatement
    {
        return $this->query;
    }
}
