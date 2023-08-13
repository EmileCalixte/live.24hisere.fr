<?php


namespace App\Misc\Util;


use App\Database\DAO;
use App\MainApp;
use ICanBoogie\Inflector;
use Psr\Http\Message\StreamInterface;

class CommonUtil
{
    /**
     * Converts recursively snake_case keys to camelCase keys in array
     * @param array $responseData
     */
    public static function camelizeArrayKeysRecursively(array &$responseData)
    {
        $inflector = new Inflector();

        foreach (array_keys($responseData) as $key) {
            $value = $responseData[$key];

            if (is_array($value)) {
                self::camelizeArrayKeysRecursively($value);
            }

            $camelizedKey = $inflector->camelize($key, Inflector::DOWNCASE_FIRST_LETTER);
            unset($responseData[$key]);

            $responseData[$camelizedKey] = $value;
        }
    }

    /**
     * Returns the category code from a birth year (valid until August 31st, 2023) {@see https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=25}
     * @param int $birthYear
     * @return string the category code
     */
    public static function getFfaCategoryFromBirthYear(int $birthYear): string
    {
        if ($birthYear >= 2017) {
            return 'BB';
        }

        if ($birthYear >= 2014) {
            return 'EA';
        }

        if ($birthYear >= 2012) {
            return 'PO';
        }

        if ($birthYear >= 2010) {
            return 'BE';
        }

        if ($birthYear >= 2008) {
            return 'MI';
        }

        if ($birthYear >= 2006) {
            return 'CA';
        }

        if ($birthYear >= 2004) {
            return 'JU';
        }

        if ($birthYear >= 2001) {
            return 'ES';
        }

        if ($birthYear >= 1989) {
            return 'SE';
        }

        if ($birthYear >= 1984) {
            return 'M0';
        }

        if ($birthYear >= 1979) {
            return 'M1';
        }

        if ($birthYear >= 1974) {
            return 'M2';
        }

        if ($birthYear >= 1969) {
            return 'M3';
        }

        if ($birthYear >= 1964) {
            return 'M4';
        }

        if ($birthYear >= 1959) {
            return 'M5';
        }

        if ($birthYear >= 1954) {
            return 'M6';
        }

        if ($birthYear >= 1949) {
            return 'M7';
        }

        if ($birthYear >= 1944) {
            return 'M8';
        }

        if ($birthYear >= 1939) {
            return 'M9';
        }

        return 'M10';
    }

    /**
     * @param string $json
     * @param bool $associative
     * @param int $depth
     * @param int $flags
     * @throws \JsonException
     */
    public static function jsonDecode(string $json, bool $associative = true, int $depth = 512, int $flags = JSON_THROW_ON_ERROR)
    {
        return json_decode($json, $associative, $depth, $flags);
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
