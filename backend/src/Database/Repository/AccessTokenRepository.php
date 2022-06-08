<?php

namespace App\Database\Repository;

use App\Database\Entity\AccessToken;
use App\Database\Entity\User;
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

    public function deleteAllOfUser(User $user)
    {
        $query = $this->createQueryBuilder('a')
            ->delete()
            ->andWhere('a.user = :userId')
            ->setParameter('userId', $user->getId())
            ->getQuery();

        return $query->execute();
    }
}
