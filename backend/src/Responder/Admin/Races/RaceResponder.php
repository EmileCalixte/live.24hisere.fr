<?php

namespace App\Responder\Admin\Races;

use App\Database\Entity\Race;
use App\Database\Entity\Runner;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class RaceResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $raceId = $args['id'];

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $race = $raceRepository->findById($raceId, asArray: true);

        if (is_null($race)) {
            throw new HttpNotFoundException($request);
        }

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $race['runnerCount'] = $runnerRepository->countByRace($race['id']);
        $race['startTime'] = DateUtil::convertDateToJavascriptDate($race['startTime']);
        $race['initialDistance'] = floatval($race['initialDistance']);
        $race['lapDistance'] = floatval($race['lapDistance']);
        unset($race['order']);

        $responseData = [
            'race' => $race,
        ];

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
