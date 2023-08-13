<?php

namespace App\Base\Singleton;

use App\Base\Singleton\Exception\SingletonException;

abstract class Singleton
{
    private static $instances = [];

    protected function __construct() {}

    public function __clone()
    {
        throw new SingletonException('Cannot clone a Singleton');
    }

    public function __wakeup()
    {
        throw new SingletonException('Cannot unserialize a Singleton');
    }

    public static function getInstance(): static
    {
        $class = static::class;

        if (!isset(self::$instances[$class])) {
            self::$instances[$class] = new static();
        }

        return self::$instances[$class];
    }
}
