#!/usr/bin/env php
<?php

require __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\Console\Application;

$application = new Application();

// Register commands
$application->add(new \App\Command\HelloWorldCommand());

$application->run();
