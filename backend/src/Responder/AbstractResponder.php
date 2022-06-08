<?php

namespace App\Responder;

use App\Security\Authentication\Authentication;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpUnauthorizedException;

abstract class AbstractResponder implements ResponderInterface
{
    protected function requireAuthentication(ServerRequestInterface $request)
    {
        $authentication = Authentication::getInstance();

        if (!$authentication->authenticationOccurred()) {
            throw new HttpForbiddenException($request, "Access token must be provided");
        }

        if (is_null($authentication->getUser())) {
            $this->throwUnauthorizedException($authentication, $request);
        }
    }

    private function throwUnauthorizedException(Authentication $authentication, ServerRequestInterface $request)
    {
        if ($authentication->isExpiredToken()) {
            throw new HttpUnauthorizedException($request, "Access token has expired");
        }

        if ($authentication->isInvalidToken()) {
            throw new HttpUnauthorizedException($request, "Access token is invalid");
        }

        throw new HttpUnauthorizedException($request, "Unable to authenticate");
    }
}
