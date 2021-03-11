<?php

use App\MainApp;

require __DIR__ . '/../vendor/autoload.php';

try { // TODO find a better way to display all errors ?
    (new MainApp())->run();
} catch (Throwable $e) {
    if (true) { // TODO DEV MODE ONLY
        dd($e);
    }

    throw $e;
}
