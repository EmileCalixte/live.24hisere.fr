<?php

namespace App\Database\Repository;

use App\Database\Entity\Runner;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\Query;

class RunnerRepository extends EntityRepository
{
    /**
     * @param bool $asArray
     * @return Runner[]|array The list of runners
     */
    public function findAll(bool $asArray = false): array
    {
        $queryBuilder = $this->createQueryBuilder('r')
            ->orderBy('r.id', 'ASC');

        if ($asArray) {
            $queryBuilder->select('r, ra.id as race_id')
                ->leftJoin('r.race', 'ra');
        }

        $query = $queryBuilder->getQuery();

        if (!$asArray) {
            return $query->getResult(Query::HYDRATE_OBJECT);
        }

        $dbResult = $query->getResult(Query::HYDRATE_ARRAY);

        // There is surely an easier way to do that...

        $result = [];

        array_walk($dbResult, function (array $row) use (&$result) {
            $resultRow = [];

            foreach ($row[0] as $key => $value) {
                $resultRow[$key] = $value;
            }

            unset($row[0]);

            foreach ($row as $key => $value) {
                if (isset($resultRow[$key])) {
                    throw new \Exception("Key already exists in result array");
                }

                $resultRow[$key] = $value;
            }

            $resultRow['category'] = CommonUtil::getFfaCategoryFromBirthYear($resultRow['birthYear']);

            array_push($result, $resultRow);
        });

        return $result;
    }

    /**
     * @param int $id
     * @param bool $asArray
     * @return Runner|array|null
     */
    public function findById(int $id, bool $asArray = false): Runner|array|null
    {
        $query = $this->createQueryBuilder('r')
            ->andWhere("r.id = :id")
            ->setParameter('id', $id)
            ->getQuery();

        try {
            return $query->getSingleResult($asArray ? Query::HYDRATE_ARRAY : Query::HYDRATE_OBJECT);
        } catch (NoResultException) {
            return null;
        }
    }

    public function countByRace(int $raceId): int
    {
        $query = $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->andWhere("r.race = :raceId")
            ->setParameter('raceId', $raceId)
            ->getQuery();

        return $query->getSingleResult(Query::HYDRATE_SINGLE_SCALAR);
    }

    public function getRanking(int $raceId, \DateTimeInterface $atDate = null): array
    {
        $connection = $this->getEntityManager()->getConnection();

        $passageTableName = 'passage';
        $runnerTableName = 'runner';

        $paramsToBind = [
            ':raceId' => $raceId,
        ];

        $sql = <<<EOF
            SELECT
                r.*,
                count(p.id) AS passage_count,
                (
                    SELECT p1.time
                    FROM $passageTableName p1
                    WHERE p1.runner_id = r.id
                    AND p1.is_hidden = 0
        EOF;

        if (!is_null($atDate)) {
            $sql .= ' AND p1.time <= :atDate';
        }

        $sql .= " AND p1.id = (SELECT p2.id FROM $passageTableName p2 WHERE p2.runner_id = p1.runner_id AND p2.is_hidden = 0";

        if (!is_null($atDate)) {
            $sql .= ' AND p2.time <= :atDate';
        }

        $sql .= <<<EOF
            ORDER BY p2.time DESC LIMIT 1)
                ) AS last_passage_time
            FROM 
                $runnerTableName r 
            LEFT JOIN 
                $passageTableName p ON p.runner_id = r.id
            AND p.is_hidden = 0
        EOF;

        if (!is_null($atDate)) {
            $sql .= ' AND p.time <= :atDate';
            $paramsToBind[':atDate'] = DateUtil::convertDateToDatabaseDate($atDate);
        }

        $sql .= <<<EOF
            WHERE r.race_id = :raceId
            GROUP BY r.id
            ORDER BY passage_count DESC, last_passage_time ASC, lastname ASC, firstname ASC
        EOF;

        $stmt = $connection->prepare($sql);

        foreach ($paramsToBind as $param => $value) {
            $stmt->bindValue($param, $value);
        }

        $result = $stmt->executeQuery();

        $ranking = [];

        while($row = $result->fetchAssociative()) {
            $row['race_id'] = (int) $row['race_id'];
            $row['passage_count'] = (int) $row['passage_count'];

            $ranking[] = $row;
        }

        return $ranking;
    }
}
