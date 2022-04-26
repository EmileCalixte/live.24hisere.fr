<?php

namespace App\Security\Authentication;

use App\Database\Entity\AccessToken;
use App\Database\Repository\AccessTokenRepository;
use App\MainApp;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthenticationMiddleware
{
    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->authenticateUserFromHeaderAccessToken($request);

        return $handler->handle($request);
    }

    private function authenticateUserFromHeaderAccessToken(ServerRequestInterface $request)
    {
        if (!$request->hasHeader('Authorization')) {
            return;
        }

        $headerAccessToken = $request->getHeaderLine('Authorization');

        /** @var AccessTokenRepository $accessTokenRepository */
        $accessTokenRepository = MainApp::getInstance()->getEntityManager()->getRepository(AccessToken::class);

        $accessToken = $accessTokenRepository->findByToken($headerAccessToken);

        if (is_null($accessToken)) {
            return;
        }

        if (new \DateTime() >= $accessToken->getExpirationDate()) {
            return;
        }

        MainApp::getInstance()->setUser($accessToken->getUser());
    }
}
