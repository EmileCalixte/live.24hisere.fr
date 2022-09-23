<?php

namespace App\Database\Repository;

use Doctrine\ORM\EntityRepository;
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
}
