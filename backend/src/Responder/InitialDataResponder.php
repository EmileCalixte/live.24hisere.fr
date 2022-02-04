<?php


namespace App\Responder;


use App\MainApp;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class InitialDataResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $data = Util::getMetadata();

        $response->getBody()->write(Util::jsonEncode($data));

        return $response;
    }
}
