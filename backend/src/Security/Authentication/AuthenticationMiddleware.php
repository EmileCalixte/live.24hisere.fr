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

            if (!is_null($headerAccessToken)) {
                Authentication::getInstance()->authenticateUserFromHeaderAccessToken($headerAccessToken);
            }
        }

        return $handler->handle($request);
    }
}
