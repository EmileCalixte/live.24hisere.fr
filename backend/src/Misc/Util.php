<?php


namespace App\Misc;


use App\MainApp;

class Util
{
    public static function convertDatabaseDateToJavascriptDate(string $dbDate, bool $withMilliseconds = true): ?string
    {
        $dbFormat = 'Y-m-d H:i:s';
        $jsFormat = 'Y-m-d\TH:i:s';

        if ($withMilliseconds) {
            $dbFormat .= '.u';
            $jsFormat .= '.u';
        }

        $date = \DateTimeImmutable::createFromFormat($dbFormat, $dbDate);

        if (!$date) {
            return null;
        }

        return $date->format($jsFormat);
    }

    public static function insertMetadataInResponseArray(array &$responseArray)
    {
        $responseArray['metadata'] = self::getMetadata();
    }

    public static function jsonEncode($data, int $flags = JSON_UNESCAPED_UNICODE, int $depth = 512): string
    {
        if(MainApp::$app->getConfig()->isDevMode()) {
            $flags |= JSON_PRETTY_PRINT;
        }

        return json_encode($data, $flags, $depth);
    }

    private static function getMetadata(): array
    {
        return MainApp::$app->getDb()->getMetadata();
    }
}
