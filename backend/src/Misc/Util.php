<?php


namespace App\Misc;


use App\MainApp;
use ICanBoogie\Inflector;
use Psr\Http\Message\MessageInterface;
use Psr\Http\Message\ResponseInterface;

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

    public static function getApiResponseWithHeaders(ResponseInterface $response): MessageInterface
    {
        return $response
            ->withHeader('Access-Control-Allow-Origin', MainApp::$app->getConfig()->getFrontendUrl())
            ->withHeader('Content-Type', 'application/json');
    }

    private static function getMetadata(): array
    {
        return MainApp::$app->getDb()->getMetadata();
    }
}
