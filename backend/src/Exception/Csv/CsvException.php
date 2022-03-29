<?php

namespace App\Exception\Csv;

use Throwable;

abstract class CsvException extends \Exception
{
    protected int $csvFileLine;

    public function __construct(int $csvFileLine, $message = "", $code = 0, Throwable $previous = null)
    {
        $this->csvFileLine = $csvFileLine;
        parent::__construct($message, $code, $previous);
    }

    public function getCsvFileLine(): int
    {
        return $this->csvFileLine;
    }
}
