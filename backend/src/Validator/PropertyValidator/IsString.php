<?php

namespace App\Validator\PropertyValidator;

class IsString extends AbstractPropertyValidator
{
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

        return !$this->hasErrors();
    }
}
