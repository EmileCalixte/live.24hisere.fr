<?php


namespace App\Responder\Ranking;


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

class RankingResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $raceId = $args['raceId'];

        if (!is_numeric($raceId)) {
            throw new HttpNotFoundException($request);
        }

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $race = $raceRepository->findById($raceId);

        if (is_null($race)) {
            throw new HttpNotFoundException($request);
        }

        $date = null;

        if (isset($_GET['at'])) {
            $date = DateUtil::convertJavascriptDateToDate($_GET['at'], withMilliseconds: false);
        }

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $ranking = $runnerRepository->getRanking($race->getId(), $date);

        for ($i = 0; $i < count($ranking); ++$i) {
            $ranking[$i]['category'] = CommonUtil::getFfaCategoryFromBirthYear($ranking[$i]['birth_year']);

            if (is_null($ranking[$i]['last_passage_time'])) {
                continue;
            }

            $ranking[$i]['last_passage_time'] = DateUtil::convertDatabaseDateToJavascriptDate($ranking[$i]['last_passage_time'], false);
        }

        $responseData = [
            'ranking' => $ranking,
        ];

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
