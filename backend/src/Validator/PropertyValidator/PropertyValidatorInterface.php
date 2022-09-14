<?php

namespace App\Validator\PropertyValidator;

interface PropertyValidatorInterface
{
    /**
     * @param array $array The array containing the property to validate
     * @param string $propertyName The name of the property to validate
     * @return void
     */
    public function init(array $array, string $propertyName): void;

    /**
     * Validates the property
     * @return bool True if the property has been validated successfully, false otherwise
     */
    public function validate(): bool;

    /**
     * Retrieves validation errors
     * @return string[] An array containing the list of errors of the validated property
     */
    public function getErrors(): array;
}
