<?php

use App\MainApp;

require __DIR__ . '/../vendor/autoload.php';

try { // TODO find a better way to display all errors ?
    (new MainApp())->run();
} catch (Throwable $e) {
    dd($e);

    if (MainApp::$app?->getConfig()?->isDevMode()) { // TODO DEV MODE ONLY
        dd($e);
    }

    throw $e;
}
