<?php

namespace App\Responder\Admin;

use App\Responder\ResponderInterface;
use App\Security\Authentication\Authentication;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UsersResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        // The user authenticated with request header access token
        dd(Authentication::getInstance()->getUser());
    }
}
