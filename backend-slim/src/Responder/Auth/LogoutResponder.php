<?php

namespace App\Responder\Auth;

use App\MainApp;
use App\Responder\AbstractResponder;
use App\Security\Authentication\Authentication;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LogoutResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $accessToken = Authentication::getInstance()->getAccessToken();

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->remove($accessToken);
        $entityManager->flush();

        return $response->withStatus(204);
    }
}
