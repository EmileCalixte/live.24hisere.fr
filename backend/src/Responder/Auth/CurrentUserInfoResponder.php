<?php

namespace App\Responder\Auth;

use App\Misc\Util\CommonUtil;
use App\Responder\AbstractResponder;
use App\Security\Authentication\Authentication;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class CurrentUserInfoResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $user = Authentication::getInstance()->getUser();

        $responseData = [
            'user' => [
                'username' => $user->getUsername(),
            ],
        ];

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
