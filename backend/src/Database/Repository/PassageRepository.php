<?php

namespace App\Database\Repository;

use App\Database\Entity\Passage;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;

class PassageRepository extends EntityRepository
{
    /**
     * @param int $runnerId
     * @param bool $asArray
     * @return Passage[]|array The list of the runner's passages, sorted by passage time
     */
    public function findByRunnerId(int $runnerId, bool $asArray = false): array
    {
        $query = $this->createQueryBuilder('p')
            ->andWhere('p.runner = :runnerId')
            ->setParameter('runnerId', $runnerId)
            ->orderBy('p.time', 'ASC')
            ->getQuery();

        return $query->getResult($asArray ? Query::HYDRATE_ARRAY : Query::HYDRATE_OBJECT);
    }

    /**
     * @return int The number of deleted passages
     */
    public function deleteAll(): int
    {
        $connection = $this->getEntityManager()->getConnection();

        $sql = "DELETE FROM passage";

        return $connection->executeQuery($sql)->rowCount();
    }
}
