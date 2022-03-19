<?php

namespace App\Responder;

use App\MainApp;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpUnauthorizedException;

class ImportDataResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $this->handleAuthorization($request);

        $this->handleRequestBody($request);


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

    private function handleRequestBody(ServerRequestInterface $request)
    {
        $tempFilePath = sys_get_temp_dir() . '/PHP_importDataBodyContent_' . str_replace('.', '', microtime(true)) . '.txt';

        try {
            Util::writeStreamInFile($request->getBody(), $tempFilePath);

            dd(file_get_contents($tempFilePath));
        } finally {
            unlink($tempFilePath);
        }
    }
}
