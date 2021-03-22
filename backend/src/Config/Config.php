<?php


namespace App\Config;


use App\Misc\Util;

class Config
{
    private const CONFIG_ARRAY_DIR_PATH = __DIR__ . '/../../config';
    private const CONFIG_ARRAY_FILENAME = 'config.php';

    private string $dbHost;
    private string $dbName;
    private string $dbUser;
    private string $dbPassword;
    private string $dbCharset = 'utf8';

    private bool $devMode = false;

    public function __construct()
    {
        $this->loadFromConfigArray();
    }

    public function getDbCharset(): string
    {
        return $this->dbCharset;
    }

    public function getDbHost(): string
    {
        return $this->dbHost;
    }

    public function getDbName(): string
    {
        return $this->dbName;
    }

    public function getDbPassword(): string
    {
        return $this->dbPassword;
    }

    public function getDbUser(): string
    {
        return $this->dbUser;
    }

    public function isDevMode(): bool
    {
        return $this->devMode;
    }

    private function getConfigArray(): array
    {
        $filePath = realpath(self::CONFIG_ARRAY_DIR_PATH) . '/' . self::CONFIG_ARRAY_FILENAME;

        if (!file_exists($filePath)) {
            throw new \RuntimeException("Configuration file $filePath does not exist");
        }

        $configArray = require($filePath);

        if (!is_array($configArray)) {
            throw new \RuntimeException("Configuration file $filePath must return an array");
        }

        return $configArray;
    }

    private function loadFromConfigArray()
    {
        $configArray = $this->getConfigArray();

        $dbHostParam = 'dbHost';
        $dbNameParam = 'dbName';
        $dbUserParam = 'dbUser';
        $dbPasswordParam = 'dbPassword';

        $devModeParam = 'devMode';

        if (!isset($configArray[$dbHostParam])) {
            throw new \RuntimeException("Configuration file must contain a '{$dbHostParam}' parameter");
        }

        if (!isset($configArray[$dbNameParam])) {
            throw new \RuntimeException("Configuration file must contain a '{$dbNameParam}' parameter");
        }

        if (!isset($configArray[$dbUserParam])) {
            throw new \RuntimeException("Configuration file must contain a '{$dbUserParam}' parameter");
        }

        if (!isset($configArray[$dbPasswordParam])) {
            throw new \RuntimeException("Configuration file must contain a '{$dbPasswordParam}' parameter");
        }

        if (!is_string($configArray[$dbHostParam])) {
            throw new \RuntimeException("'{$dbHostParam}' parameter in configuration file must be a string");
        }

        if (!is_string($configArray[$dbNameParam])) {
            throw new \RuntimeException("'{$dbNameParam}' parameter in configuration file must be a string");
        }

        if (!is_string($configArray[$dbUserParam])) {
            throw new \RuntimeException("'{$dbUserParam}' parameter in configuration file must be a string");
        }

        if (!is_string($configArray[$dbPasswordParam])) {
            throw new \RuntimeException("'{$dbPasswordParam}' parameter in configuration file must be a string");
        }

        $this->dbHost = $configArray[$dbHostParam];
        $this->dbName = $configArray[$dbNameParam];
        $this->dbUser = $configArray[$dbUserParam];
        $this->dbPassword = $configArray[$dbPasswordParam];

        if (isset($configArray[$devModeParam])) {
            if (!is_bool($configArray[$devModeParam])) {
                throw new \RuntimeException("'{$devModeParam}' parameter in configuration file must be a boolean");
            }

            $this->devMode = $configArray[$devModeParam];
        }
    }
}
