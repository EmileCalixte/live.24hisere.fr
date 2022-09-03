<?php


namespace App\Responder;


use App\Database\Entity\Passage;
use App\Database\Entity\Runner;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class RunnerDetailsResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $runnerId = $args['id'];

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $runner = $runnerRepository->findById($runnerId, asArray: true);

        if (is_null($runner)) {
            throw new HttpNotFoundException($request);
        }

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        $passages = $passageRepository->findByRunnerId($runnerId);

        $runner['passages'] = array_map(function (Passage $passage) {
            return [
                'id' => $passage->getId(),
                'time' => DateUtil::convertDateToJavascriptDate($passage->getTime()),
            ];
        }, $passages);

        $responseData = [
            'runner' => $runner,
        ];

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
