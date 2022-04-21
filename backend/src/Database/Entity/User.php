<?php

namespace App\Database\Entity;

use App\Database\Repository\UserRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;

#[Entity(repositoryClass: UserRepository::class)]
#[Table('user')]
class User
{
    private const USERNAME_MAX_LENGTH = 32;

    #[Id, GeneratedValue]
    #[Column]
    private int $id;

    #[Column(length: self::USERNAME_MAX_LENGTH)]
    private string $username;

    #[Column(name: 'password_hash')]
    private string $passwordHash;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function setPasswordHash(string $passwordHash): void
    {
        $this->passwordHash = $passwordHash;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): void
    {
        if (!ctype_alnum($username)) {
            throw new \InvalidArgumentException('Username must be alphanumeric');
        }

        if (mb_strlen($username) > self::USERNAME_MAX_LENGTH) {
            throw new \InvalidArgumentException('Username max length is ' . self::USERNAME_MAX_LENGTH . ' characters');
        }

        $this->username = $username;
    }


}
