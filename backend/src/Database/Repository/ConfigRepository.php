<?php

namespace App\Database\Repository;

use App\Database\Entity\Config;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;

class ConfigRepository extends EntityRepository
{
    public function findByKey(string $key): ?Config
    {
        $query = $this->createQueryBuilder('c')
            ->andWhere('c.key = :key')
            ->setParameter('key', $key)
            ->getQuery();

        try {
            return $query->getSingleResult();
        } catch (NoResultException) {
            return null;
        }
    }

    public function getKeyValue(string $key): ?string
    {
        $config = $this->findByKey($key);

        if (is_null($config)) {
            return null;
        }

        return $config->getValue();
    }
}
