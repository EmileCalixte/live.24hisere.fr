<?php

namespace App\Database\Repository;

use App\MainApp;
use Doctrine\ORM\EntityRepository;

class RepositoryProvider
{
    public static function getRepository(string $entityClass): EntityRepository
    {
        return MainApp::getInstance()->getEntityManager()->getRepository($entityClass);
    }
}
