<?php


namespace App\Responder;


use App\Database\Entity\Runner;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RankingResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $date = null;

        if (isset($_GET['at'])) {
            $date = Util::convertJavascriptDateToDate($_GET['at'], withMilliseconds: false);
        }

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $ranking = $runnerRepository->getRanking($date);

        for ($i = 0; $i < count($ranking); ++$i) {
            if (is_null($ranking[$i]['last_passage_time'])) {
                continue;
            }

            $ranking[$i]['last_passage_time'] = Util::convertDatabaseDateToJavascriptDate($ranking[$i]['last_passage_time']);
            $ranking[$i]['is_team'] = (bool) $ranking[$i]['is_team'];
        }

        $responseData = [
            'ranking' => $ranking,
        ];

        Util::insertMetadataInResponseArray($responseData);
        Util::camelizeApiResponseFields($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return $response;
    }
}
