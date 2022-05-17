<?php

namespace App\Security\Authentication;

use App\Base\Singleton\Singleton;
use App\Database\Entity\AccessToken;
use App\Database\Entity\User;
use App\Database\Repository\AccessTokenRepository;
use App\MainApp;

class Authentication extends Singleton
{
    /**
     * @var User|null If valid credentials are provided in request, the corresponding user
     */
    private User|null $user = null;

    public function authenticateUserFromHeaderAccessToken(string $stringAccessToken)
    {
        /** @var AccessTokenRepository $accessTokenRepository */
        $accessTokenRepository = MainApp::getInstance()->getEntityManager()->getRepository(AccessToken::class);

        $accessToken = $accessTokenRepository->findByToken($stringAccessToken);

        if (is_null($accessToken)) {
            return;
        }

        if (new \DateTime() >= $accessToken->getExpirationDate()) {
            return;
        }

        $this->user = $accessToken->getUser();
    }

    public function getUser(): ?User
    {
        return $this->user;
    }
}
