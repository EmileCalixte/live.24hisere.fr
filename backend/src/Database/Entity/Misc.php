<?php

namespace App\Database\Entity;

use App\Database\Repository\MiscRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;

#[Entity(repositoryClass: MiscRepository::class)]
#[Table('misc')]
class Misc
{
    public const KEY_LAST_UPDATE_TIME = 'last_update_time';

    private const KEY_MAX_LENGTH = 255;
    private const VALUE_MAX_LENGTH = 5000;

    #[Id]
    #[Column(length: self::KEY_MAX_LENGTH)]
    private string $key;

    #[Column(length: self::VALUE_MAX_LENGTH)]
    private string $value;

    public function getKey(): string
    {
        return $this->key;
    }

    public function setKey(string $key): void
    {
        if (mb_strlen($key) > self::KEY_MAX_LENGTH) {
            throw new \InvalidArgumentException('Key max length is ' . self::KEY_MAX_LENGTH . ' characters');
        }

        $this->key = $key;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): void
    {
        if (mb_strlen($value) > self::VALUE_MAX_LENGTH) {
            throw new \InvalidArgumentException('Value max length is ' . self::VALUE_MAX_LENGTH . ' characters');
        }

        $this->value = $value;
    }
}
