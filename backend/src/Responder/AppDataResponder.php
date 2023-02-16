<?php


namespace App\Responder;


use App\Database\Entity\Misc;
use App\Database\Repository\MiscRepository;
use App\Database\Repository\RepositoryProvider;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class AppDataResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $currentDate = (new \DateTimeImmutable())->setTimezone(new \DateTimeZone('Europe/Paris'));

        /** @var MiscRepository $miscRepository */
        $miscRepository = RepositoryProvider::getRepository(Misc::class);

        $lastUpdateTime = $miscRepository->getLastUpdateTime();

        $data['currentTime'] = DateUtil::convertDateToJavascriptDate($currentDate, false);
        $data['lastUpdateTime'] = DateUtil::convertDateToJavascriptDate($lastUpdateTime, false);

        $response->getBody()->write(CommonUtil::jsonEncode($data));

        return $response;
    }
}
