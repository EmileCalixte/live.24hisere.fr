<?php

namespace App\Database\Entity;

use App\Database\Repository\RunnerRepository;
use App\Misc\Util\CommonUtil;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
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

    #[Column(length: 1)]
    private string $gender;

    #[Column(name: 'birth_year')]
    private string $birthYear;

    #[ManyToOne(targetEntity: Race::class)]
    #[JoinColumn(nullable: false)]
    private Race $race;

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

    /**
     * @return string The category code, or "INV" if category cannot be determined because of invalid birth year
     */
    public function getCategoryCode(): string
    {
        try {
            return CommonUtil::getFfaCategoryFromBirthYear($this->birthYear);
        } catch (\Exception) {
            return "INV";
        }
    }

    public function getRace(): Race
    {
        return $this->race;
    }

    public function setRace(Race $race): void
    {
        $this->race = $race;
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
