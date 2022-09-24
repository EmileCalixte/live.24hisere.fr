<?php

namespace App\Database\Repository;

use App\Database\Entity\Race;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\Query;

class RaceRepository extends EntityRepository
{
    public function findAll(bool $asArray = false): array
    {
        $query = $this->createQueryBuilder('r')
            ->orderBy('r.order', 'ASC')
            ->getQuery();

        return $query->getResult($asArray ? Query::HYDRATE_ARRAY : Query::HYDRATE_OBJECT);
    }

    public function findById(int $id, bool $asArray = false): Race|array|null
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

    public function getMaxOrder()
    {
        $query = $this->createQueryBuilder('r')
            ->select("MAX(r.order)")
            ->getQuery();

        return $query->getSingleResult(Query::HYDRATE_SINGLE_SCALAR);
    }
}
