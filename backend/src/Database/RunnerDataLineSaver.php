<?php

namespace App\Database;

use App\Misc\Util;
use App\Model\RunnersCsvDataLine\DataLine;

class RunnerDataLineSaver
{
    private \PDO $database;

    private \PDOStatement $query;

    public function __construct()
    {
        $this->database = DAO::getInstance()->getDatabase();
        $this->query = $this->getDatabase()->prepare('INSERT INTO ' . DAO::TABLE_RUNNER . ' (id, is_team, lastname, firstname, gender, birth_year, category) VALUES (:id, :isTeam, :lastname, :firstname, :gender, :birthYear, :category)' );
    }

    public function saveDataLine(DataLine $dataLine): bool
    {
        $id = $dataLine->getRunnerId();
        $isTeam = 0; // TODO handle teams
        $firstname = $dataLine->getRunnerFirstname();
        $lastname = $dataLine->getRunnerLastname();
        $gender = $dataLine->getRunnerGender();
        $birthYear = $dataLine->getRunnerBirthYear();
        $category = Util::getFfaCategoryFromBirthYear($birthYear);

        $this->getQuery()->bindParam(':id', $id);
        $this->getQuery()->bindParam(':isTeam', $isTeam);
        $this->getQuery()->bindParam(':firstname', $firstname);
        $this->getQuery()->bindParam(':lastname', $lastname);
        $this->getQuery()->bindParam(':gender', $gender);
        $this->getQuery()->bindParam(':birthYear', $birthYear);
        $this->getQuery()->bindParam(':category', $category);
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
