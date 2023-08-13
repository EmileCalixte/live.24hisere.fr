<?php

namespace App\Validator\PropertyValidator\CustomValidator;

use App\Database\Entity\Race;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\Validator\PropertyValidator\AbstractPropertyValidator;

class RaceNameIsNotUsed extends AbstractPropertyValidator
{
    public function __construct(
        /** @var int|null $existingRaceId A race to be ignored if it is found with this name. Used when modifying a race */
        private ?int $existingRaceId = null
    )
    {
    }

    public function validate(): bool
    {
        if (!isset($this->array[$this->propertyName])) {
            return !$this->hasErrors();
        }

        $raceName = $this->array[$this->propertyName];

        if (!is_string($raceName)) {
            return !$this->hasErrors();
        }

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $existingRace = $raceRepository->findByName($raceName);

        if (!is_null($existingRace) && $existingRace->getId() !== $this->existingRaceId) {
            $this->addError('A race with the same name already exists');
        }

        return !$this->hasErrors();
    }
}
