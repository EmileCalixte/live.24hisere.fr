<?php

namespace App\Security\Authentication;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthenticationMiddleware
{
    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if ($request->hasHeader('Authorization')) {
            $headerAccessToken = $request->getHeaderLine('Authorization');

            Authentication::getInstance()->authenticateUserFromHeaderAccessToken($headerAccessToken);
        }

        return $handler->handle($request);
    }
}
