<?php


namespace App\Misc;


use App\Database\DAO;
use App\MainApp;
use ICanBoogie\Inflector;
use Psr\Http\Message\StreamInterface;

class Util
{
    /**
     *
     * @param array $responseData
     */
    public static function camelizeApiResponseFields(array &$responseData)
    {
        $inflector = new Inflector();

        foreach (array_keys($responseData) as $key) {
            $value = $responseData[$key];

            if (is_array($value)) {
                self::camelizeApiResponseFields($value);
            }

            $camelizedKey = $inflector->camelize($key, Inflector::DOWNCASE_FIRST_LETTER);
            unset($responseData[$key]);

            $responseData[$camelizedKey] = $value;
        }
    }

    public static function convertDatabaseDateToJavascriptDate(string $dbDate, bool $withMilliseconds = true): ?string
    {
        $dbFormat = 'Y-m-d H:i:s';

        if ($withMilliseconds) {
            $dbFormat .= '.u';
        }

        $date = \DateTimeImmutable::createFromFormat($dbFormat, $dbDate);

        if (!$date) {
            return null;
        }

        return self::convertDateToJavascriptDate($date, $withMilliseconds);
    }

    public static function convertDateToJavascriptDate(\DateTimeInterface $date, bool $withMilliseconds = true): ?string
    {
        $jsFormat = 'Y-m-d\TH:i:s';

        if ($withMilliseconds) {
            $jsFormat .= '.u';
        }

        return $date->format($jsFormat);
    }

    /**
     * Returns the category code from a birth year (valid until october 31st, 2022) {@see https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=25}
     * @param int $birthYear
     * @return string the category code
     */
    public static function getFfaCategoryFromBirthYear(int $birthYear): string
    {
        if ($birthYear >= 2016) {
            return 'BB';
        }

        if ($birthYear >= 2013) {
            return 'EA';
        }

        if ($birthYear >= 2011) {
            return 'PO';
        }

        if ($birthYear >= 2009) {
            return 'BE';
        }

        if ($birthYear >= 2007) {
            return 'MI';
        }

        if ($birthYear >= 2005) {
            return 'CA';
        }

        if ($birthYear >= 2003) {
            return 'JU';
        }

        if ($birthYear >= 2000) {
            return 'ES';
        }

        if ($birthYear >= 1988) {
            return 'SE';
        }

        if ($birthYear >= 1983) {
            return 'M0';
        }

        if ($birthYear >= 1978) {
            return 'M1';
        }

        if ($birthYear >= 1973) {
            return 'M2';
        }

        if ($birthYear >= 1968) {
            return 'M3';
        }

        if ($birthYear >= 1963) {
            return 'M4';
        }

        if ($birthYear >= 1958) {
            return 'M5';
        }

        if ($birthYear >= 1953) {
            return 'M6';
        }

        if ($birthYear >= 1948) {
            return 'M7';
        }

        if ($birthYear >= 1943) {
            return 'M8';
        }

        if ($birthYear >= 1938) {
            return 'M9';
        }

        return 'M10';
    }

    public static function getMetadata(): array
    {
        $data = DAO::getInstance()->getMetadata();

        $currentDate = (new \DateTimeImmutable())->setTimezone(new \DateTimeZone('Europe/Paris'));

        $data['currentTime'] = Util::convertDateToJavascriptDate($currentDate, false);

        Util::camelizeApiResponseFields($data);

        return $data;
    }

    public static function insertMetadataInResponseArray(array &$responseArray)
    {
        $responseArray['metadata'] = self::getMetadata();
    }

    public static function jsonEncode($data, int $flags = JSON_UNESCAPED_UNICODE, int $depth = 512): string
    {
        if(MainApp::getInstance()->getConfig()->isDevMode()) {
            $flags |= JSON_PRETTY_PRINT;
        }

        return json_encode($data, $flags, $depth);
    }

    /**
     * Writes stream content into file without memory issues for large content
     * @param StreamInterface $stream The input stream
     * @param string $filePath Path of the file where to write stream content
     * @param int $chunkSize Maximum number of bytes in a reading
     */
    public static function writeStreamInFile(StreamInterface $stream, string $filePath, int $chunkSize = 2048)
    {
        $handle = fopen($filePath, 'w');

        if ($handle === false) {
            throw new \RuntimeException('Cannot create file');
        }

        while (!$stream->eof()) {
            fwrite($handle, $stream->read($chunkSize));
        }

        fclose($handle);
    }
}
