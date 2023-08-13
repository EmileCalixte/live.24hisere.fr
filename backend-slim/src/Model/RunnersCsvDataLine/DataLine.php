<?php

namespace App\Model\RunnersCsvDataLine;

use App\Model\RunnersCsvDataLine\Exception\InvalidDataCountException;
use App\Model\RunnersCsvDataLine\Exception\InvalidDataFormatException;

class DataLine
{
    private int $runnerId;
    private string $runnerFirstname;
    private string $runnerLastname;
    private int $runnerBirthYear;
    private ?string $runnerGender;

    private const ALLOWED_GENDERS = [
        'M',
        'F',
    ];

    /**
     * @param array $line an array containing the data of a line, get with {@see fgetcsv()}
     * @throws InvalidDataCountException if line contains an invalid number of data
     * @throws InvalidDataFormatException if a data is malformed or invalid
     */
    public function __construct(array $line)
    {
        if (count($line) !== 5) {
            throw new InvalidDataCountException();
        }

        $this->runnerId = intval($line[0]);
        $this->runnerFirstname = $line[2];
        $this->runnerLastname = $line[1];

        $runnerBirthDate = \DateTimeImmutable::createFromFormat('d/m/Y', $line[3]);

        if ($runnerBirthDate === false) {
            throw new InvalidDataFormatException("Invalid runner birth date format");
        }

        $this->runnerBirthYear = intval($runnerBirthDate->format('Y'));

        if (empty($line[4])) {
            $this->runnerGender = null;
        } elseif (in_array($line[4], self::ALLOWED_GENDERS)) {
            $this->runnerGender = $line[4];
        } else {
            throw new InvalidDataFormatException("Invalid runner gender");
        }
    }

    public function getRunnerId(): int
    {
        return $this->runnerId;
    }

    public function getRunnerFirstname(): string
    {
        return $this->runnerFirstname;
    }

    public function getRunnerLastname(): string
    {
        return $this->runnerLastname;
    }

    public function getRunnerBirthYear(): int
    {
        return $this->runnerBirthYear;
    }

    public function getRunnerGender(): ?string
    {
        return $this->runnerGender;
    }
}
