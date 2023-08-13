<?php

use App\Config\Config;
use App\MainApp;

require __DIR__ . '/../vendor/autoload.php';

try { // TODO find a better way to display all errors ?
    MainApp::getInstance()->run();
} catch (Throwable $e) {

    if (!Config::$loaded) {
        die($e->getMessage());
    }

    if (MainApp::getInstance()?->getConfig()?->isDevMode()) {
        dd($e);
    }

    throw $e;
}
