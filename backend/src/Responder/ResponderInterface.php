<?php


namespace App\Responder;


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

interface ResponderInterface
{
    public function respond(
        ServerRequestInterface $request,
        ResponseInterface $response,
        $args
    );
}
