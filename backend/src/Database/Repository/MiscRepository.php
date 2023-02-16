<?php

namespace App\Database\Repository;

use App\Database\Entity\Misc;
use App\Misc\Util\DateUtil;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;

class MiscRepository extends EntityRepository
{
    public function getLastUpdateTime(): ?\DateTimeImmutable
    {
        $lastUpdateTimeString = $this->getKeyValue(Misc::KEY_LAST_UPDATE_TIME);

        if (is_null($lastUpdateTimeString)) {
            return null;
        }

        $lastUpdateTime = DateUtil::convertDatabaseDateToDate($lastUpdateTimeString, withMilliseconds: false);

        if (!$lastUpdateTime) {
            throw new \Exception("Cannot read last update time, maybe the value in database is malformed");
        }

        return $lastUpdateTime;
    }

    private function findByKey(string $key): ?Misc
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

    private function getKeyValue(string $key): ?string
    {
        $config = $this->findByKey($key);

        if (is_null($config)) {
            return null;
        }

        return $config->getValue();
    }
}
