<?php

namespace App\Responder;

use App\Security\Authentication\Authentication;
use Psr\Http\Message\ServerRequestInterface;

abstract class AbstractResponder implements ResponderInterface
{
    protected function requireAuthentication(ServerRequestInterface $request) {
        // The user authenticated with request header access token
        dd(Authentication::getInstance()->getUser());
        // TODO throw exception if user is not authenticated
    }
}
