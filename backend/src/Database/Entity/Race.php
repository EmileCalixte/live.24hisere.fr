<?php

namespace App\Database\Entity;

use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\PersistentCollection;

#[Entity(repositoryClass: RaceRepository::class)]
#[Table('race')]
class Race
{
    public const NAME_MAX_LENGTH = 50;

    #[Id, GeneratedValue]
    #[Column]
    private int $id;

    #[Column(length: self::NAME_MAX_LENGTH, unique: true)]
    private string $name;

    #[Column(name:"is_public")]
    private bool $isPublic;

    #[Column(name:"`order`")] // "order" is a reserved keyword in SQL (https://stackoverflow.com/a/41166639/13208770)
    private int $order;

    #[Column(name: "start_time", type: "datetime")]
    private \DateTime $startTime;

    /** @var float The distance covered by the runners before their first passage at the checkpoint */
    #[Column(name: "initial_distance", type: "decimal", precision: 10, scale: 3)]
    private float $initialDistance;

    #[Column(name: "lap_distance", type: "decimal", precision: 10, scale: 3)]
    private float $lapDistance;

    #[OneToMany(targetEntity: Runner::class, mappedBy: "race")]
    private PersistentCollection $runners;

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

    public function isPublic(): bool
    {
        return $this->isPublic;
    }

    public function setIsPublic(bool $isPublic): void
    {
        $this->isPublic = $isPublic;
    }

    public function getOrder(): int
    {
        return $this->order;
    }

    public function setOrder(int $order): void
    {
        $this->order = $order;
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

    public function getRunners(): PersistentCollection
    {
        return $this->runners;
    }

    public function setRunners(PersistentCollection $runners): void
    {
        $this->runners = $runners;
    }

    public function getRunnerCount(): int
    {
        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        return $runnerRepository->countByRace($this->getId());
    }
}
