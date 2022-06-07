<?php


namespace App\Responder;


use App\Database\Entity\Runner;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RankingResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $date = null;

        if (isset($_GET['at'])) {
            $date = DateUtil::convertJavascriptDateToDate($_GET['at'], withMilliseconds: false);
        }

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $ranking = $runnerRepository->getRanking($date);

        for ($i = 0; $i < count($ranking); ++$i) {
            if (is_null($ranking[$i]['last_passage_time'])) {
                continue;
            }

            $ranking[$i]['last_passage_time'] = DateUtil::convertDatabaseDateToJavascriptDate($ranking[$i]['last_passage_time'], false);
            $ranking[$i]['is_team'] = (bool) $ranking[$i]['is_team'];
        }

        $responseData = [
            'ranking' => $ranking,
        ];

        CommonUtil::insertMetadataInResponseArray($responseData);
        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
