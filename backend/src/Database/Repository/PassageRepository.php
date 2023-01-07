<?php

namespace App\Database\Repository;

use App\Database\Entity\Passage;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\Query;

class PassageRepository extends EntityRepository
{
    /**
     * @param int $id
     * @param bool $asArray
     * @return Passage|array|null
     */
    public function findById(int $id, bool $asArray = false): Passage|array|null
    {
        $query = $this->createQueryBuilder('p')
            ->andWhere('p.id = :id')
            ->setParameter('id', $id)
            ->getQuery();

        try {
            return $query->getSingleResult($asArray ? Query::HYDRATE_ARRAY : Query::HYDRATE_OBJECT);
        } catch (NoResultException) {
            return null;
        }
    }

    /**
     * @param int $detectionId
     * @return Passage|null
     */
    public function findByDetectionId(int $detectionId): Passage|null
    {
        $query = $this->createQueryBuilder('p')
            ->andWhere('p.detectionId = :detectionId')
            ->setParameter('detectionId', $detectionId)
            ->getQuery();

        try {
            return $query->getSingleResult();
        } catch (NoResultException) {
            return null;
        }
    }

    /**
     * @param int $runnerId
     * @param bool $asArray
     * @param bool $includeHidden
     * @return Passage[]|array The list of the runner's passages, sorted by passage time
     */
    public function findByRunnerId(int $runnerId, bool $asArray = false, bool $includeHidden = false): array
    {
        $queryBuilder = $this->createQueryBuilder('p')
            ->andWhere('p.runner = :runnerId')
            ->setParameter('runnerId', $runnerId)
            ->orderBy('p.time', 'ASC');

        if (!$includeHidden) {
            $queryBuilder->andWhere('p.isHidden = 0');
        }

        $query = $queryBuilder->getQuery();

        return $query->getResult($asArray ? Query::HYDRATE_ARRAY : Query::HYDRATE_OBJECT);
    }

    public function updateAllOfRunner(int $oldRunnerId, int $newRunnerId)
    {
        $query = $this->createQueryBuilder('p')
            ->update()
            ->set('p.runner', ':newRunnerId')
            ->andWhere('p.runner = :oldRunnerId')
            ->setParameter('newRunnerId', $newRunnerId)
            ->setParameter('oldRunnerId', $oldRunnerId)
            ->getQuery();

        return $query->execute();
    }

    public function deleteAllOfRunner(int $runnerId)
    {
        $query = $this->createQueryBuilder('p')
            ->delete()
            ->andWhere('p.runner = :runnerId')
            ->setParameter('runnerId', $runnerId)
            ->getQuery();

        return $query->execute();
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
