<?php

namespace App\Validator\PropertyValidator;

class IsString extends AbstractPropertyValidator
{
    public function __construct(
        private ?int $maxLength = null
    )
    {
    }

    public function validate(): bool
    {
        $this->errors = [];

        if (!isset($this->array[$this->propertyName])) {
            return !$this->hasErrors();
        }

        $value = $this->array[$this->propertyName];

        if (!is_string($value)) {
            $this->addError('This value must be a string');
        }

        $this->validateMaxLength($value);

        return !$this->hasErrors();
    }

    private function validateMaxLength(string $value)
    {
        if (is_null($this->maxLength)) {
            return;
        }

        if (mb_strlen($value) > $this->maxLength) {
            $this->addError("This value cannot be longer than $this->maxLength characters");
        }
    }
}
