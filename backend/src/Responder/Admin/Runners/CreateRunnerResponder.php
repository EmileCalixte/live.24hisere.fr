<?php

namespace App\Responder\Admin\Runners;

use App\Database\Entity\Race;
use App\Database\Entity\Runner;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\MainApp;
use App\Misc\Util\CommonUtil;
use App\Responder\AbstractResponder;
use App\Validator\ArrayValidator;
use App\Validator\PropertyValidator\CustomValidator\RaceIdExists;
use App\Validator\PropertyValidator\CustomValidator\RunnerIdIsNotUsed;
use App\Validator\PropertyValidator\IsRequired;
use App\Validator\PropertyValidator\TypeValidator\IsGenderString;
use App\Validator\PropertyValidator\TypeValidator\IsInt;
use App\Validator\PropertyValidator\TypeValidator\IsString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class CreateRunnerResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $bodyParams = $this->getBodyJsonAsArray($request);

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('id', new IsRequired());
        $bodyValidator->addValidator('id', new IsInt(minValue: 1, maxValue: 999999));
        $bodyValidator->addValidator('id', new RunnerIdIsNotUsed());
        $bodyValidator->addValidator('firstname', new IsRequired());
        $bodyValidator->addValidator('firstname', new IsString(maxLength: Runner::FIRSTNAME_MAX_LENGTH));
        $bodyValidator->addValidator('lastname', new IsRequired());
        $bodyValidator->addValidator('lastname', new IsString(maxLength: Runner::LASTNAME_MAX_LENGTH));
        $bodyValidator->addValidator('gender', new IsRequired());
        $bodyValidator->addValidator('gender', new IsGenderString());
        $bodyValidator->addValidator('birthYear', new IsRequired());
        $bodyValidator->addValidator('birthYear', new IsInt(minValue: 1900, maxValue: date("Y")));
        $bodyValidator->addValidator('raceId', new IsRequired());
        $bodyValidator->addValidator('raceId', new RaceIdExists());

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

        $race = $raceRepository->findById($bodyParams['raceId']);

        $runner = new Runner();
        $runner->setId($bodyParams['id']);
        $runner->setFirstname($bodyParams['firstname']);
        $runner->setLastname($bodyParams['lastname']);
        $runner->setGender($bodyParams['gender']);
        $runner->setBirthYear($bodyParams['birthYear']);
        $runner->setRace($race);

        // TODO remove this
        $runner->setIsTeam(false);

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->persist($runner);
        $entityManager->flush();

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $runnerAsArray = $runnerRepository->findById($runner->getId(), asArray: true);

        $runnerAsArray['raceId'] = $race->getId();
        $runnerAsArray['category'] = CommonUtil::getFfaCategoryFromBirthYear($runnerAsArray['birthYear']);

        $responseData = $runnerAsArray;

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response->withStatus(201);
    }
}
