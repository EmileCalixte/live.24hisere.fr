<?php

namespace App\Validator\PropertyValidator;

class IsDateString extends AbstractPropertyValidator
{
    public function __construct(private string $dateFormat = 'Y-m-d\TH:i:s')
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
            $this->addError('This value must be a date');
        }

        $date = \DateTime::createFromFormat($this->dateFormat, $value);

        if (!$date) {
            $this->addError('This value must be a date ' + $value);
        }

        return !$this->hasErrors();
    }
}
