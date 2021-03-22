<?php


namespace App\Responder;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class HelloResponder implements ResponderInterface
{
    public function respond (ServerRequestInterface $request, ResponseInterface $response, $args) {
        $response->getBody()->write("Hello world!");
        return $response;
    }
}
