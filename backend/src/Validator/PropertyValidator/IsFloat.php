<?php

namespace App\Validator\PropertyValidator;

class IsFloat extends AbstractPropertyValidator
{
    public function validate(): bool
    {
        $this->errors = [];

        if (!isset($this->array[$this->propertyName])) {
            return !$this->hasErrors();
        }

        $value = $this->array[$this->propertyName];

        if (!is_numeric($value)) {
            $this->addError('This value must be a number');
        }

        return !$this->hasErrors();
    }
}
