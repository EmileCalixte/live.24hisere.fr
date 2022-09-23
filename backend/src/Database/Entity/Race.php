<?php

namespace App\Database\Entity;

use App\Database\Repository\RaceRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;

#[Entity(repositoryClass: RaceRepository::class)]
#[Table('race')]
class Race
{
    private const RACE_MAX_LENGTH = 50;

    #[Id, GeneratedValue]
    #[Column]
    private int $id;

    #[Column(length: self::RACE_MAX_LENGTH, unique: true)]
    private string $name;

    #[Column(type: "datetime")]
    private \DateTime $startTime;

    /** @var float The distance covered by the runners before their first passage at the checkpoint */
    #[Column(name: "initial_distance", type: "decimal", precision: 10, scale: 3)]
    private float $initialDistance;

    #[Column(name: "lap_distance", type: "decimal", precision: 10, scale: 3)]
    private float $lapDistance;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getStartTime(): \DateTime
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTime $startTime): void
    {
        $this->startTime = $startTime;
    }

    public function getInitialDistance(): float
    {
        return $this->initialDistance;
    }

    public function setInitialDistance(float $initialDistance): void
    {
        $this->initialDistance = $initialDistance;
    }

    public function getLapDistance(): float
    {
        return $this->lapDistance;
    }

    public function setLapDistance(float $lapDistance): void
    {
        $this->lapDistance = $lapDistance;
    }
}
