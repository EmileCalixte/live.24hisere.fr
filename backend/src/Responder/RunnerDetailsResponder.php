<?php


namespace App\Responder;


use App\Database\Entity\Passage;
use App\Database\Entity\Runner;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class RunnerDetailsResponder implements ResponderInterface
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
                'time' => Util::convertDateToJavascriptDate($passage->getTime()),
            ];
        }, $passages);

        $responseData = [
            'runner' => $runner,
        ];

        Util::insertMetadataInResponseArray($responseData);
        Util::camelizeApiResponseFields($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return $response;
    }
}
