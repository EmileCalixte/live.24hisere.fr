<?php

namespace App\Responder\Admin\Races;

use App\Database\Entity\Race;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\MainApp;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use App\Responder\AbstractResponder;
use App\Validator\ArrayValidator;
use App\Validator\PropertyValidator\CustomValidator\RaceNameIsNotUsed;
use App\Validator\PropertyValidator\TypeValidator\IsBool;
use App\Validator\PropertyValidator\TypeValidator\IsDateString;
use App\Validator\PropertyValidator\TypeValidator\IsFloat;
use App\Validator\PropertyValidator\TypeValidator\IsString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class UpdateRaceResponder extends AbstractResponder
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

        $bodyParams = $this->getBodyJsonAsArray($request);

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('name', new IsString(maxLength: Race::NAME_MAX_LENGTH));
        $bodyValidator->addValidator('name', (new RaceNameIsNotUsed())->setExistingRaceId($raceId));
        $bodyValidator->addValidator('isPublic', new IsBool());
        $bodyValidator->addValidator('startTime', new IsDateString());
        $bodyValidator->addValidator('initialDistance', new IsFloat());
        $bodyValidator->addValidator('lapDistance', new IsFloat());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        $this->updateRace($race, $bodyParams);

        $raceAsArray = $raceRepository->findById($race->getId(), asArray: true);
        $raceAsArray['startTime'] = DateUtil::convertDateToJavascriptDate($raceAsArray['startTime']);
        $raceAsArray['runnerCount'] = $race->getRunnerCount();

        $responseData = $raceAsArray;

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }

    private function updateRace(Race $race, array $bodyParams)
    {
        if (empty($bodyParams)) {
            return;
        }

        if (isset($bodyParams['name'])) {
            $race->setName($bodyParams['name']);
        }

        if (isset($bodyParams['isPublic'])) {
            $race->setIsPublic($bodyParams['isPublic']);
        }

        if (isset($bodyParams['startTime'])) {
            $startTime = DateUtil::convertJavascriptDateToDate($bodyParams['startTime'], false, false);
            $race->setStartTime($startTime);
        }

        if (isset($bodyParams['initialDistance'])) {
            $race->setInitialDistance($bodyParams['initialDistance']);
        }

        if (isset($bodyParams['lapDistance'])) {
            $race->setLapDistance($bodyParams['lapDistance']);
        }

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->persist($race);
        $entityManager->flush();
    }
}
