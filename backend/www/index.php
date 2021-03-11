<?php

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function (ServerRequestInterface $request, ResponseInterface $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->run();
