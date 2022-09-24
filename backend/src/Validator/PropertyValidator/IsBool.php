<?php

namespace App\Validator\PropertyValidator;

class IsBool extends AbstractPropertyValidator
{
    public function validate(): bool
    {
        $this->errors = [];

        if (!isset($this->array[$this->propertyName])) {
            return !$this->hasErrors();
        }

        $value = $this->array[$this->propertyName];

        if (is_int($value)) {
            $value = (bool) $value;
        }

        if (!is_bool($value)) {
            $this->addError('This value must be a boolean');
        }

        return !$this->hasErrors();
    }
}
