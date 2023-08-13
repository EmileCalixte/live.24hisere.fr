<?php

namespace App\Validator\PropertyValidator;

class IsRequired extends AbstractPropertyValidator
{
    public function validate(): bool
    {
        $this->errors = [];

        if ($this->propertyIsMissing()) {
            $this->addError('This value is required');
        }

        return !$this->hasErrors();
    }

    private function propertyIsMissing(): bool
    {
        if (!isset($this->array[$this->propertyName])) {
            return true;
        }

        if ($this->array[$this->propertyName] === '') {
            return true;
        }

        return false;
    }
}
