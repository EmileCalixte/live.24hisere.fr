<?php


namespace App\Responder;


use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class AppDataResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        // TODO add last update time

        $currentDate = (new \DateTimeImmutable())->setTimezone(new \DateTimeZone('Europe/Paris'));

        $data['currentTime'] = DateUtil::convertDateToJavascriptDate($currentDate, false);

        $response->getBody()->write(CommonUtil::jsonEncode($data));

        return $response;
    }
}
