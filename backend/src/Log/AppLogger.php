<?php

namespace App\Log;

use App\MainApp;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Stringable;

class AppLogger extends \App\Base\Singleton\Singleton
{
    private Logger $logger;

    protected function __construct()
    {
        parent::__construct();

        $this->logger = new Logger('main');
        $this->logger->pushHandler(new StreamHandler(MainApp::$rootDir . '/logs/logs.txt'));
        $this->logger->pushProcessor(function (array $entry): array {
            $entry['extra']['_GET'] = $_GET;
            $entry['extra']['_POST'] = $_POST;
            $entry['extra']['_FILES'] = $_FILES;
            $entry['extra']['request'] = [
                'url' => $_SERVER['REQUEST_URI'],
                'method' => $_SERVER['REQUEST_METHOD'],
                'headers' => getallheaders(),
            ];

            return $entry;
        });
    }

    /**
     * Adds a log record at an arbitrary level.
     * @param mixed             $level   The log level
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function log($level, $message, array $context = []): void
    {
        self::getInstance()->logger->log($level, $message, $context);
    }

    /**
     * Adds a log record at the DEBUG level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function debug($message, array $context = []): void
    {
        self::getInstance()->logger->debug($message, $context);
    }

    /**
     * Adds a log record at the INFO level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function info($message, array $context = []): void
    {
        self::getInstance()->logger->info($message, $context);
    }

    /**
     * Adds a log record at the NOTICE level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function notice($message, array $context = []): void
    {
        self::getInstance()->logger->notice($message, $context);
    }

    /**
     * Adds a log record at the WARNING level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function warning($message, array $context = []): void
    {
        self::getInstance()->logger->warning($message, $context);
    }

    /**
     * Adds a log record at the ERROR level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function error($message, array $context = []): void
    {
        self::getInstance()->logger->error($message, $context);
    }

    /**
     * Adds a log record at the CRITICAL level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function critical($message, array $context = []): void
    {
        self::getInstance()->logger->critical($message, $context);
    }

    /**
     * Adds a log record at the ALERT level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function alert($message, array $context = []): void
    {
        self::getInstance()->logger->alert($message, $context);
    }

    /**
     * Adds a log record at the EMERGENCY level.
     * @param string|Stringable $message The log message
     * @param mixed[]           $context The log context
     */
    public static function emergency($message, array $context = []): void
    {
        self::getInstance()->logger->emergency($message, $context);
    }
}
