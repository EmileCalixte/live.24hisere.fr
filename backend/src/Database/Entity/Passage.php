<?php

namespace App\Database\Entity;

use App\Database\Repository\PassageRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;

#[Entity(repositoryClass: PassageRepository::class)]
#[Table('passage')]
class Passage
{
    #[Id, GeneratedValue]
    #[Column]
    private int $id;

    #[Column(name: "detection_id", type: "integer", unique: true, nullable: true, options: [
        'comment' => 'Not null if the passage comes from a detection of the timing system'
    ])]
    private int|null $detectionId;

    #[ManyToOne(targetEntity: Runner::class, fetch: "EAGER")]
    #[JoinColumn(nullable: false)]
    private Runner $runner;

    #[Column(type: "datetime")]
    private \DateTime $time;

    #[Column(name: "is_hidden")]
    private bool $isHidden;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getDetectionId(): int|null
    {
        return $this->detectionId;
    }

    public function setDetectionId(int|null $detectionId): void
    {
        $this->detectionId = $detectionId;
    }

    public function getRunner(): Runner
    {
        return $this->runner;
    }

    public function setRunner(Runner $runner): void
    {
        $this->runner = $runner;
    }

    public function getTime(): \DateTime
    {
        return $this->time;
    }

    public function setTime(\DateTime $time): void
    {
        $this->time = $time;
    }

    public function isHidden(): bool
    {
        return $this->isHidden;
    }

    public function setIsHidden(bool $isHidden): void
    {
        $this->isHidden = $isHidden;
    }
}
