<?php

namespace App\Database\Repository;

use App\Database\Entity\AccessToken;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;

class AccessTokenRepository extends EntityRepository
{
    public function findByToken(string $token): ?AccessToken
    {
        $query = $this->createQueryBuilder('a')
            ->andWhere('a.token = :token')
            ->setParameter('token', $token)
            ->getQuery();

        try {
            return $query->getSingleResult();
        } catch (NoResultException) {
            return null;
        }
    }
}
