<?php

namespace App\Database;


use App\MainApp;
use App\Model\PassagesFileDataLine\DataLine;
use Doctrine\DBAL\Statement;

class RunnerPassageDataLineSaver
{
    private Statement $statement;

    public function __construct()
    {
        $connection = MainApp::getInstance()->getEntityManager()->getConnection();
        $this->statement = $connection->prepare('INSERT INTO passage (id, runner_id, time) VALUES (:id, :runnerId, :time)');
    }

    public function saveDataLine(DataLine $dataLine): bool
    {
        $id = $dataLine->getPassageId();
        $runnerId = $dataLine->getRunnerId();
        $passageTime = $dataLine->getPassageDateTime()->format('Y-m-d H:i:s');

        $this->statement->bindParam('id', $id);
        $this->statement->bindParam('runnerId', $runnerId);
        $this->statement->bindParam('time', $passageTime);

        return (bool) $this->statement->executeQuery()->rowCount();
    }
}
