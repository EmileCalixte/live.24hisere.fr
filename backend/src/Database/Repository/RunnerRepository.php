<?php

namespace App\Database\Repository;

use App\Database\Entity\Runner;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\Query;

class RunnerRepository extends EntityRepository
{
    public function findAll(bool $asArray = false): array
    {
        $query = $this->createQueryBuilder('r')
            ->orderBy('r.id', 'ASC')
            ->getQuery();

        return $query->getResult($asArray ? Query::HYDRATE_ARRAY : Query::HYDRATE_OBJECT);
    }

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

    /**
     * @return string[]
     * @throws \Doctrine\DBAL\Exception
     */
    public function getCategories(): array
    {
        $connection = $this->getEntityManager()->getConnection();
        $sql = "SELECT DISTINCT category FROM runner";

        $stmt = $connection->prepare($sql);
        return $stmt->executeQuery()->fetchFirstColumn();
    }
}
