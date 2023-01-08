<?php

namespace App\Validator\PropertyValidator\CustomValidator;

use App\Database\Entity\Race;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\Validator\PropertyValidator\AbstractPropertyValidator;

class RaceIdExists extends AbstractPropertyValidator
{
    public function validate(): bool
    {
        if (!isset($this->array[$this->propertyName])) {
            return !$this->hasErrors();
        }

        $raceId = $this->array[$this->propertyName];

        if (!is_numeric($raceId)) {
            $this->addError('No race with this ID exists');
            return !$this->hasErrors();
        }

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $existingRace = $raceRepository->findById($raceId);

        if (is_null($existingRace)) {
            $this->addError('No race with this ID exists');
        }

        return !$this->hasErrors();
    }
}
