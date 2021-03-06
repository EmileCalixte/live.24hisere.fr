<?php

namespace App\Database\Entity;

use App\Database\Repository\RunnerRepository;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\PersistentCollection;

#[Entity(repositoryClass: RunnerRepository::class)]
#[Table('runner')]
class Runner
{
    #[Id, GeneratedValue("NONE")]
    #[Column(options: ['comment' => 'Bib number'])]
    private int $id;

    #[Column(name: 'is_team')]
    private bool $isTeam;

    #[Column]
    private string $firstname;

    #[Column]
    private string $lastname;

    #[Column(length: 1, nullable: true)]
    private string $gender;

    #[Column(name: 'birth_year', nullable: true)]
    private string $birthYear;

    #[Column(length: 15)]
    private string $category;

    #[OneToMany(targetEntity: Passage::class, mappedBy: "runner")]
    private PersistentCollection $passages;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function isTeam(): bool
    {
        return $this->isTeam;
    }

    public function setIsTeam(bool $isTeam): void
    {
        $this->isTeam = $isTeam;
    }

    public function getFirstname(): string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): void
    {
        $this->firstname = $firstname;
    }

    public function getLastname(): string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): void
    {
        $this->lastname = $lastname;
    }

    public function getGender(): string
    {
        return $this->gender;
    }

    public function setGender(string $gender): void
    {
        $this->gender = $gender;
    }

    public function getBirthYear(): string
    {
        return $this->birthYear;
    }

    public function setBirthYear(string $birthYear): void
    {
        $this->birthYear = $birthYear;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function setCategory(string $category): void
    {
        $this->category = $category;
    }

    public function getPassages(): PersistentCollection
    {
        return $this->passages;
    }

    public function setPassages(PersistentCollection $passages): void
    {
        $this->passages = $passages;
    }
}
