<?php

namespace App\Validator\PropertyValidator\CustomValidator;

use App\Database\Entity\Runner;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Validator\PropertyValidator\AbstractPropertyValidator;

class RunnerIdIsNotUsed extends AbstractPropertyValidator
{
    public function __construct(
        /** @var int|null $existingRunnerId A runner to be ignored if it is found with this name. Used when modifying a runner */
        private ?int $existingRunnerId = null
    )
    {
    }

    public function validate(): bool
    {
        if (!isset($this->array[$this->propertyName])) {
            return !$this->hasErrors();
        }

        $runnerId = $this->array[$this->propertyName];

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $existingRunner = $runnerRepository->findById($runnerId);

        if (!is_null($existingRunner) && $existingRunner->getId() !== $this->existingRunnerId) {
            $this->addError('A runner with the same ID already exists');
        }

        return !$this->hasErrors();
    }
}
