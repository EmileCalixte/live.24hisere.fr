<?php

namespace App\Model\DataLine;

use App\Model\DataLine\Exception\InvalidLineFormatException;

class DataLine
{
    private int $runnerId;

    private \DateTimeImmutable $passageDateTime;

    /**
     * @param string $line the line to parse
     * @throws InvalidLineFormatException if line is malformed
     */
    public function __construct(string $line)
    {
        $explodedLine = preg_split('/\s+/', trim($line));

        $this->runnerId = intval($explodedLine[2]);

        $passageDateString = $explodedLine[6];
        $passageTimeString = explode('.', $explodedLine[4])[0]; // 'convert' hh:mm:ss.cc to hh:mm:ss (ignore hundredths)

        $passageDateTime = \DateTimeImmutable::createFromFormat('d/m/Y H:i:s', "$passageDateString $passageTimeString");

        if ($passageDateTime === false) {
            throw new InvalidLineFormatException("Cannot read date or time from line: $line");
        }

        $this->passageDateTime = $passageDateTime;
    }

    public function getRunnerId(): int
    {
        return $this->runnerId;
    }

    public function getPassageDateTime(): \DateTimeImmutable
    {
        return $this->passageDateTime;
    }
}
