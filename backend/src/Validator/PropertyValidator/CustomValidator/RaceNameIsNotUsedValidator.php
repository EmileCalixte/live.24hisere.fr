<?php

namespace App\Validator\PropertyValidator\CustomValidator;

use App\Database\Entity\Race;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\Validator\PropertyValidator\AbstractPropertyValidator;

class RaceNameIsNotUsedValidator extends AbstractPropertyValidator
{
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

        if (!is_null($existingRace)) {
            $this->addError('A race with the same name already exists');
        }

        return !$this->hasErrors();
    }
}
