<?php

namespace App\Responder\Admin;

use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UsersResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        // TODO return users
        $response->getBody()->write("Access granted");
        return $response;
    }
}
