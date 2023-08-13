<?php

namespace App\Database\Repository;

use App\Database\Entity\Misc;
use App\MainApp;
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

    public function setLastUpdateTime(\DateTimeInterface $lastUpdateTime)
    {
        $lastUpdateTimeString = DateUtil::convertDateToDatabaseDate($lastUpdateTime);

        $this->setKeyValue(Misc::KEY_LAST_UPDATE_TIME, $lastUpdateTimeString);
        $this->setKeyValue("toto", "titi");
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
        $misc = $this->findByKey($key);

        if (is_null($misc)) {
            return null;
        }

        return $misc->getValue();
    }

    private function setKeyValue(string $key, string $value)
    {
        $misc = $this->findByKey($key);

        if (is_null($misc)) {
            $misc = new Misc();
            $misc->setKey($key);
        }

        $misc->setValue($value);

        MainApp::getInstance()->getEntityManager()->persist($misc);
        MainApp::getInstance()->getEntityManager()->flush();
    }
}
