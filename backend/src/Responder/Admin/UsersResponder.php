<?php

namespace App\Responder\Admin;

use App\Responder\AbstractResponder;
use App\Security\Authentication\Authentication;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UsersResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        // The user authenticated with request header access token
        dd(Authentication::getInstance()->getUser());
    }
}
