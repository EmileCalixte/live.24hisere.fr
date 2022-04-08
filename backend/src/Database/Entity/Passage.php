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
    #[Id, GeneratedValue("NONE")]
    #[Column]
    private int $id;

    #[ManyToOne(targetEntity: Runner::class, fetch: "EAGER")]
    #[JoinColumn(nullable: false)]
    private Runner $runner;

    #[Column(type: "datetime")]
    private \DateTime $time;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
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
}
