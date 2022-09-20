<?php


namespace App\Responder;


use App\Misc\Util\CommonUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RaceDataResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $data = CommonUtil::getRaceData();

        $response->getBody()->write(CommonUtil::jsonEncode($data));

        return $response;
    }
}
