<?php

namespace App\Security\Authentication;

use App\Base\Singleton\Singleton;
use App\Database\Entity\AccessToken;
use App\Database\Entity\User;
use App\Database\Repository\AccessTokenRepository;
use App\MainApp;

class Authentication extends Singleton
{
    private const ERROR_INVALID_TOKEN = 1;
    private const ERROR_EXPIRED_TOKEN = 2;

    private bool $authenticationOccurred = false;

    /**
     * @var AccessToken|null If valid credentials are provided in request, the corresponding access token
     */
    private AccessToken|null $accessToken = null;

    /**
     * @var User|null If valid credentials are provided in request, the corresponding user
     */
    private User|null $user = null;

    /**
     * @var int|null If the authentication failed, the nature of the error
     */
    private int|null $authenticationError = null;

    public function authenticateUserFromHeaderAccessToken(string $stringAccessToken)
    {
        $this->authenticationOccurred = true;

        /** @var AccessTokenRepository $accessTokenRepository */
        $accessTokenRepository = MainApp::getInstance()->getEntityManager()->getRepository(AccessToken::class);

        $accessToken = $accessTokenRepository->findByToken($stringAccessToken);

        if (is_null($accessToken)) {
            $this->authenticationError = self::ERROR_INVALID_TOKEN;
            return;
        }

        if (new \DateTime() >= $accessToken->getExpirationDate()) {
            $this->authenticationError = self::ERROR_EXPIRED_TOKEN;
            return;
        }

        $this->accessToken = $accessToken;
        $this->user = $accessToken->getUser();
    }

    public function authenticationOccurred(): bool
    {
        return $this->authenticationOccurred;
    }

    public function getAccessToken(): ?AccessToken
    {
        return $this->accessToken;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function getAuthenticationError(): ?int
    {
        return $this->authenticationError;
    }

    public function isInvalidToken(): bool
    {
        return $this->getAuthenticationError() === self::ERROR_INVALID_TOKEN;
    }

    public function isExpiredToken(): bool
    {
        return $this->getAuthenticationError() === self::ERROR_EXPIRED_TOKEN;
    }
}
