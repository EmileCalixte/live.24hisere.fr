<?php

namespace App\Responder\Admin\Races;

use App\Database\Entity\Race;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\MainApp;
use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpNotFoundException;

class DeleteRaceResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $raceId = $args['id'];

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $race = $raceRepository->findById($raceId);

        if (is_null($race)) {
            throw new HttpNotFoundException($request);
        }

        if ($race->getRunnerCount() > 0) {
            throw new HttpBadRequestException($request, "Cannot delete a race if there are runners in it");
        }

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->remove($race);
        $entityManager->flush();

        return $response->withStatus(204);
    }
}
