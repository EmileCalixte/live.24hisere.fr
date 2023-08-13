<?php

namespace App\Responder\Admin\Runners;

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

class RunnersResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $runners = $runnerRepository->findAll(asArray: true);

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $races = $raceRepository->findAll(asArray: true);

        $responseRaces = [];

        array_walk($races, function ($race) use (&$responseRaces) {
            $race['startTime'] = DateUtil::convertDateToJavascriptDate($race['startTime']);
            $race['initialDistance'] = floatval($race['initialDistance']);
            $race['lapDistance'] = floatval($race['lapDistance']);
            unset($race['order']);

            $responseRaces[$race['id']] = $race;
        });

        $responseData = [
            'races' => $responseRaces,
            'runners' => $runners,
        ];

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
