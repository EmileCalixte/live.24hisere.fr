<?php

namespace App\Validator;

use App\Validator\PropertyValidator\PropertyValidatorInterface;

class ArrayValidator
{
    /**
     * @var array The array containing properties to validate
     */
    private array $array;

    private array $validators = [];

    private array $errors = [];

    /**
     * @param array $array The array containing properties to validate
     */
    public function __construct(array $array)
    {
        $this->array = $array;
    }

    public function addValidator(string $propertyName, PropertyValidatorInterface $validator)
    {
        $validator->init($this->array, $propertyName);
        $this->validators[$propertyName][] = $validator;
    }

    public function validate(): bool
    {
        $this->errors = [];

        foreach ($this->validators as $propertyName => $validators) {
            foreach ($validators as $validator) {
                $this->runValidator($propertyName, $validator);
            }
        }

        return !$this->hasErrors();
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }

    private function runValidator(string $propertyName, PropertyValidatorInterface $validator) {
        if (!$validator->validate()) {
            $this->addErrorsForProperty($propertyName, $validator->getErrors());
        }
    }

    private function addErrorsForProperty(string $propertyName, array $errors)
    {
        if (!isset($this->errors[$propertyName])) {
            $this->errors[$propertyName] = [];
        }

        $this->errors[$propertyName] += [...$errors];
    }
}
