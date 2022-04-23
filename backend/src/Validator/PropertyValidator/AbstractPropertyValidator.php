<?php

namespace App\Validator\PropertyValidator;

abstract class AbstractPropertyValidator implements PropertyValidatorInterface
{
    /**
     * @var array The array containing properties to validate
     */
    protected array $array;

    /**
     * @var string Name of the {@see $array} property that have to be validated
     */
    protected string $propertyName;

    /**
     * @var string[] List of errors of the validated property
     */
    protected array $errors = [];

    protected bool $isInitialized = false;

    public function init(array $array, string $propertyName): void
    {
        $this->array = $array;
        $this->propertyName = $propertyName;

        $this->isInitialized = true;
    }

    /**
     * @return string[] List of errors of the validated property
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * @return bool True if the validated property has errors
     */
    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }

    protected function addError(string $error): void
    {
        $this->errors[] = $error;
    }
}
