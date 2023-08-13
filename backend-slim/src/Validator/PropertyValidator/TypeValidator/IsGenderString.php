<?php

namespace App\Validator\PropertyValidator\TypeValidator;

use App\Validator\PropertyValidator\AbstractPropertyValidator;

class IsGenderString extends AbstractPropertyValidator
{
    public function validate(): bool
    {
        $this->errors = [];

        if (!isset($this->array[$this->propertyName])) {
            return !$this->hasErrors();
        }

        $value = $this->array[$this->propertyName];

        if (!in_array($value, ['M', 'F'])) {
            $this->addError("This value must be either 'M' or 'F'");
        }

        return !$this->hasErrors();
    }
}
