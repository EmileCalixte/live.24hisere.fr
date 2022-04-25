<?php

namespace App\Database\Entity;

use App\Database\Repository\AccessTokenRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;

#[Entity(repositoryClass: AccessTokenRepository::class)]
#[Table('access_token')]
class AccessToken
{
    private const TOKEN_LENGTH = 32;

    #[Id]
    #[Column(length: self::TOKEN_LENGTH)]
    private string $token;

    #[ManyToOne(targetEntity: User::class, fetch: "EAGER")]
    #[JoinColumn(nullable: false)]
    private User $user;

    #[Column(name: 'expiration_date')]
    private \DateTime $expirationDate;

    public function getToken(): string
    {
        return $this->token;
    }

    public function setToken(string $token): void
    {
        if (mb_strlen($token) !== self::TOKEN_LENGTH) {
            throw new \InvalidArgumentException("Token must be " . self::TOKEN_LENGTH . " characters long");
        }

        $this->token = $token;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getExpirationDate(): \DateTime
    {
        return $this->expirationDate;
    }

    public function setExpirationDate(\DateTime $expirationDate): void
    {
        $this->expirationDate = $expirationDate;
    }
}
