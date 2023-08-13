<?php

// This file is needed for the Doctrine CLI (must be named cli-config.php and must be in the app root directory)

use App\MainApp;

require __DIR__ . '/vendor/autoload.php';

$entityManager = MainApp::getInstance()->getEntityManager();

return \Doctrine\ORM\Tools\Console\ConsoleRunner::createHelperSet($entityManager);
