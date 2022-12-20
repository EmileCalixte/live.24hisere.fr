<?php

namespace App\Responder\Admin\Runners;

use App\Database\Entity\Passage;
use App\Database\Entity\Runner;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class RunnerResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $runnerId = $args['id'];

        if (!is_numeric($runnerId)) {
            throw new HttpNotFoundException($request);
        }

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $runner = $runnerRepository->findById($runnerId, asArray: true);

        if (is_null($runner)) {
            throw new HttpNotFoundException($request);
        }

        // TODO optimize
        $runner['raceId'] = $runnerRepository->findById($runnerId)->getRace()->getId();

        $runner['category'] = CommonUtil::getFfaCategoryFromBirthYear($runner['birthYear']);

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        $passages = $passageRepository->findByRunnerId($runnerId);

        $runner['passages'] = array_map(function (Passage $passage) {
            return [
                'id' => $passage->getId(),
                'detectionId' => $passage->getDetectionId(),
                'time' => DateUtil::convertDateToJavascriptDate($passage->getTime()),
                'isHidden' => $passage->isHidden(),
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
