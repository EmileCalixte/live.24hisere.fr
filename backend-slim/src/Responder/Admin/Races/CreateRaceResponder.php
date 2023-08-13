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
use App\Validator\PropertyValidator\IsRequired;
use App\Validator\PropertyValidator\TypeValidator\IsBool;
use App\Validator\PropertyValidator\TypeValidator\IsDateString;
use App\Validator\PropertyValidator\TypeValidator\IsFloat;
use App\Validator\PropertyValidator\TypeValidator\IsInt;
use App\Validator\PropertyValidator\TypeValidator\IsString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class CreateRaceResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $bodyParams = $this->getBodyJsonAsArray($request);

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('name', new IsRequired());
        $bodyValidator->addValidator('name', new IsString(maxLength: Race::NAME_MAX_LENGTH));
        $bodyValidator->addValidator('name', new RaceNameIsNotUsed());
        $bodyValidator->addValidator('isPublic', new IsRequired());
        $bodyValidator->addValidator('isPublic', new IsBool());
        $bodyValidator->addValidator('startTime', new IsRequired());
        $bodyValidator->addValidator('startTime', new IsDateString());
        $bodyValidator->addValidator('duration', new IsRequired());
        $bodyValidator->addValidator('duration', new IsInt(minValue: 0));
        $bodyValidator->addValidator('initialDistance', new IsRequired());
        $bodyValidator->addValidator('initialDistance', new IsFloat());
        $bodyValidator->addValidator('lapDistance', new IsRequired());
        $bodyValidator->addValidator('lapDistance', new IsFloat());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        /** @var RaceRepository $raceRepository */
        $raceRepository = RepositoryProvider::getRepository(Race::class);
        $raceOrder = $raceRepository->getMaxOrder() + 1;

        $race = new Race();
        $race->setName($bodyParams['name']);
        $race->setIsPublic($bodyParams['isPublic']);
        $race->setOrder($raceOrder);
        $race->setStartTime(DateUtil::convertJavascriptDateToDate(
            $bodyParams['startTime'],
            withMilliseconds: false,
            immutable: false,
        ));
        $race->setDuration($bodyParams['duration']);
        $race->setInitialDistance($bodyParams['initialDistance']);
        $race->setLapDistance($bodyParams['lapDistance']);

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->persist($race);
        $entityManager->flush();

        $raceAsArray = $raceRepository->findById($race->getId(), asArray: true);
        $raceAsArray['startTime'] = DateUtil::convertDateToJavascriptDate($raceAsArray['startTime']);
        $raceAsArray['runnerCount'] = $race->getRunnerCount();

        $responseData = $raceAsArray;

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response->withStatus(201);
    }
}
