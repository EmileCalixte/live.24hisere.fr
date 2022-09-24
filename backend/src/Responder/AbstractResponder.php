<?php

namespace App\Responder;

use App\Misc\Util\CommonUtil;
use App\Security\Authentication\Authentication;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpUnauthorizedException;

abstract class AbstractResponder implements ResponderInterface
{
    /**
     * @param ServerRequestInterface $request
     * @throws HttpUnauthorizedException If user cannot be authenticated with provided credentials
     * @throws HttpForbiddenException If no credentials are provided
     */
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

    /**
     * @param ServerRequestInterface $request
     * @return array An associative array representing the json passed in request body
     * @throws HttpBadRequestException If body content cannot be parsed or is not a json object
     */
    protected function getBodyJsonAsArray(ServerRequestInterface $request): array
    {
        $requestBody = $request->getBody()->getContents();

        try {
            $bodyParams = CommonUtil::jsonDecode($requestBody);
        } catch (\JsonException $e) {
            throw new HttpBadRequestException($request, null, $e);
        }

        if (!is_array($bodyParams)) {
            throw new HttpBadRequestException($request);
        }

        return $bodyParams;
    }

    /**
     * @param Authentication $authentication The {@see Authentication} instance
     * @param ServerRequestInterface $request
     * @throws HttpUnauthorizedException
     */
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
