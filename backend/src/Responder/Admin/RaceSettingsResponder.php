<?php

namespace App\Responder\Admin;

use App\Misc\Util\CommonUtil;
use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RaceSettingsResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $data = CommonUtil::getRaceData(false);

        $response->getBody()->write(CommonUtil::jsonEncode($data));

        return $response;
    }
}
