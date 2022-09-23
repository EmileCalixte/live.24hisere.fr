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

class RacesResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $races = $raceRepository->findAll(asArray: true);

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        array_walk($races, function (&$race) use ($runnerRepository) {
            $race['runnerCount'] = $runnerRepository->countByRace($race['id']);
            $race['startTime'] = DateUtil::convertDateToJavascriptDate($race['startTime']);
        });

        $responseData = [
            'races' => $races,
        ];

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
