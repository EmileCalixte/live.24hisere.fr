<?php

namespace App\Misc\Util;

class DateUtil
{
    public static function convertDatabaseDateToDate(string $dbDate, bool $withMilliseconds = true, bool $immutable = true): \DateTime|\DateTimeImmutable|null
    {
        $dbFormat = 'Y-m-d H:i:s';

        if ($withMilliseconds) {
            $dbFormat .= '.v';
        }

        if ($immutable) {
            $date = \DateTimeImmutable::createFromFormat($dbFormat, $dbDate);
        } else {
            $date = \DateTime::createFromFormat($dbFormat, $dbDate);
        }

        if ($date === false) {
            return null;
        }

        return $date;
    }

    public static function convertDatabaseDateToJavascriptDate(string $dbDate, bool $withMilliseconds = true): ?string
    {
        $date = self::convertDatabaseDateToDate($dbDate, $withMilliseconds);

        if (!$date) {
            return null;
        }

        return self::convertDateToJavascriptDate($date, $withMilliseconds);
    }

    public static function convertDateToJavascriptDate(\DateTimeInterface $date, bool $withMilliseconds = true): ?string
    {
        $jsFormat = 'Y-m-d\TH:i:s';

        if ($withMilliseconds) {
            $jsFormat .= '.v';
        }

        return $date->format($jsFormat);
    }

    public static function convertJavascriptDateToDate(string $jsDate, bool $withMilliseconds = true, bool $immutable = true): \DateTime|\DateTimeImmutable|null
    {
        /** @var \DateTimeImmutable|\DateTime $class */
        $class = $immutable ? \DateTimeImmutable::class : \DateTime::class;

        $jsFormat = 'Y-m-d\TH:i:s';

        if ($withMilliseconds) {
            $jsFormat .= '.v';
        }

        $date = $class::createFromFormat($jsFormat, $jsDate);

        if ($date === false) {
            return null;
        }

        return $date;
    }

    public static function convertDateToDatabaseDate(\DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }
}
