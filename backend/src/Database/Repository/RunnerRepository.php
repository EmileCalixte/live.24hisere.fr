<?php

namespace App\Database\Repository;

use App\Database\Entity\Runner;
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
        $query = $this->createQueryBuilder('r')
            ->orderBy('r.id', 'ASC')
            ->getQuery();

        return $query->getResult($asArray ? Query::HYDRATE_ARRAY : Query::HYDRATE_OBJECT);
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

    /**
     * @return string[] The list of category codes for which there is at least one runner
     * @throws \Doctrine\DBAL\Exception
     */
    public function getCategories(): array
    {
        $connection = $this->getEntityManager()->getConnection();
        $sql = "SELECT DISTINCT category FROM runner";

        $stmt = $connection->prepare($sql);
        return $stmt->executeQuery()->fetchFirstColumn();
    }

    public function getRanking(\DateTimeInterface $atDate = null): array
    {
        $connection = $this->getEntityManager()->getConnection();

        $passageTableName = 'passage';
        $runnerTableName = 'runner';

        $paramsToBind = [];

        $sql = <<<EOF
            SELECT
                r.*,
                count(p.id) AS passage_count,
                (
                    SELECT p1.time
                    FROM $passageTableName p1
                    WHERE p1.runner_id = r.id
        EOF;

        if (!is_null($atDate)) {
            $sql .= ' AND p1.time <= :atDate';
        }

        $sql .= " AND p1.id = (SELECT p2.id FROM $passageTableName p2 WHERE p2.runner_id = p1.runner_id";

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
        EOF;

        if (!is_null($atDate)) {
            $sql .= ' AND p.time <= :atDate';
            $paramsToBind[':atDate'] = DateUtil::convertDateToDatabaseDate($atDate);
        }

        $sql .= <<<EOF
            GROUP BY r.id
            ORDER BY passage_count DESC, last_passage_time ASC, lastname ASC, firstname ASC
        EOF;

        $stmt = $connection->prepare($sql);

        foreach ($paramsToBind as $param => $value) {
            $stmt->bindParam($param, $value);
        }

        return $stmt->executeQuery()->fetchAllAssociative();
    }
}
