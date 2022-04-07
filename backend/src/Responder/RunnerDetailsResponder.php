<?php


namespace App\Responder;


use App\Database\DAO;
use App\Database\Entity\Runner;
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

        $dbPassages = DAO::getInstance()->getRunnerPassages($runnerId);

        $responseData = [
            'runner' => $runner + ['passages' => $dbPassages],
        ];

        Util::insertMetadataInResponseArray($responseData);
        Util::camelizeApiResponseFields($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return $response;
    }
}
