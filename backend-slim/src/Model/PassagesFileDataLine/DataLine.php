<?php

namespace App\Model\PassagesFileDataLine;

use App\Model\PassagesFileDataLine\Exception\InvalidLineFormatException;

class DataLine
{
    private int $passageId;

    private int $lineId;

    private int $runnerId;

    private string $detectionType;

    private \DateTimeImmutable $passageDateTime;

    /**
     * @param string $line the line to parse
     * @throws InvalidLineFormatException if line is malformed
     */
    public function __construct(string $line)
    {
        $explodedLine = preg_split('/\s+/', trim($line));

        $this->passageId = intval($explodedLine[0]);
        $this->lineId = intval($explodedLine[1]);
        $this->runnerId = intval($explodedLine[2]);
        $this->detectionType = $explodedLine[5];

        $passageDateString = $explodedLine[6];
        $passageTimeString = explode('.', $explodedLine[4])[0]; // 'convert' hh:mm:ss.cc to hh:mm:ss (ignore hundredths)

        $passageDateTime = \DateTimeImmutable::createFromFormat('d/m/Y H:i:s', "$passageDateString $passageTimeString");

        if ($passageDateTime === false) {
            throw new InvalidLineFormatException("Cannot read date or time from line: $line");
        }

        $this->passageDateTime = $passageDateTime;
    }

    public function getPassageId(): int
    {
        return $this->passageId;
    }

    public function getRunnerId(): int
    {
        return $this->runnerId;
    }

    public function getLineId(): int
    {
        return $this->lineId;
    }

    public function getDetectionType(): string
    {
        return $this->detectionType;
    }

    public function getPassageDateTime(): \DateTimeImmutable
    {
        return $this->passageDateTime;
    }
}
