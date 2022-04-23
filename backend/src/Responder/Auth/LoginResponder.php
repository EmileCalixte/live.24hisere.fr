<?php

namespace App\Responder\Auth;

use App\Misc\Util\CommonUtil;
use App\Responder\ResponderInterface;
use App\Validator\ArrayValidator;
use App\Validator\PropertyValidator\IsRequired;
use App\Validator\PropertyValidator\IsString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpBadRequestException;

class LoginResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $bodyParams = $request->getParsedBody();

        if (!is_array($bodyParams)) {
            throw new HttpBadRequestException($request);
        }

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('username', new IsRequired());
        $bodyValidator->addValidator('username', new IsString());
        $bodyValidator->addValidator('password', new IsRequired());
        $bodyValidator->addValidator('password', new IsString());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        // TODO check credentials and authenticate user


    }
}
