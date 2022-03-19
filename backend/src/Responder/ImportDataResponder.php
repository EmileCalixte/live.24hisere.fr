<?php

namespace App\Responder;

use App\MainApp;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpUnauthorizedException;

class ImportDataResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $this->handleAuthorization($request);

        dd('Authorization OK');

        return $response;
    }

    /**
     * @param ServerRequestInterface $request The request
     * @throws HttpUnauthorizedException if request cannot be authorized
     */
    private function handleAuthorization(ServerRequestInterface $request)
    {
        $secretKey = MainApp::getInstance()->getConfig()->getImportDataSecretKey();

        $authorizationHeader = $request->getHeader('Authorization');

        if (empty($authorizationHeader)) {
            throw new HttpUnauthorizedException($request, "Authorization header is missing");
        }

        $headerSecretKey = $authorizationHeader[0];

        if ($headerSecretKey !== $secretKey) {
            throw new HttpUnauthorizedException($request, "Invalid credentials");
        }
    }
}
