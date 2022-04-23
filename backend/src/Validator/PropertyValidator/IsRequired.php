<?php

namespace App\Validator\PropertyValidator;

class IsRequired extends AbstractPropertyValidator
{
    public function validate(): bool
    {
        $this->errors = [];

        if (!isset($this->array[$this->propertyName])) {
            $this->addError('This value is required');
        }

        return !$this->hasErrors();
    }
}
