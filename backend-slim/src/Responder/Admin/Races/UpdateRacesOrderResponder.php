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

class UpdateRacesOrderResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $requestBody = $this->getBodyJsonAsArray($request, false);

        if (!is_array($requestBody)) {
            throw new HttpBadRequestException($request);
        }

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);

        $entityManager = MainApp::getInstance()->getEntityManager();

        $order = 0;

        foreach ($requestBody as $raceId) {
            $race = $raceRepository->findById($raceId);

            if (is_null($race)) {
                continue;
            }

            $race->setOrder($order);
            ++$order;

            $entityManager->persist($race);
        }

        $entityManager->flush();

        return $response
            ->withStatus(204);
    }
}
