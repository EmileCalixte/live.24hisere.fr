<?php

namespace App\Validator\PropertyValidator\TypeValidator;

use App\Validator\PropertyValidator\AbstractPropertyValidator;

class IsInt extends AbstractPropertyValidator
{
    public function __construct(
        private ?int $minValue = null,
        private ?int $maxValue = null,
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

        if (is_string($value)) {
            if (!ctype_digit($value)) {
                $this->addError('This value must be an integer');
                return !$this->hasErrors();
            }
        } elseif (!is_int($value)) {
            $this->addError('This value must be an integer');
            return !$this->hasErrors();
        }

        $value = (int) $value;

        $this->validateMinValue($value);
        $this->validateMaxValue($value);

        return !$this->hasErrors();
    }

    private function validateMinValue(int $value)
    {
        if (is_null($this->minValue)) {
            return;
        }

        if ($value < $this->minValue) {
            $this->addError("This value must not be less than $this->minValue");
        }
    }

    private function validateMaxValue(int $value)
    {
        if (is_null($this->maxValue)) {
            return;
        }

        if ($value > $this->maxValue) {
            $this->addError("This value must not be more than $this->maxValue");
        }
    }
}
