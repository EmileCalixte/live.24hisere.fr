<?php

namespace App\Responder\Admin\Runners;

use App\Database\Entity\Passage;
use App\Database\Entity\Race;
use App\Database\Entity\Runner;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RaceRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\MainApp;
use App\Misc\Util\CommonUtil;
use App\Responder\AbstractResponder;
use App\Validator\ArrayValidator;
use App\Validator\PropertyValidator\CustomValidator\RaceIdExists;
use App\Validator\PropertyValidator\CustomValidator\RunnerIdIsNotUsed;
use App\Validator\PropertyValidator\TypeValidator\IsGenderString;
use App\Validator\PropertyValidator\TypeValidator\IsInt;
use App\Validator\PropertyValidator\TypeValidator\IsString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class UpdateRunnerResponder extends AbstractResponder
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

        $runner = $runnerRepository->findById($runnerId);

        if (is_null($runner)) {
            throw new HttpNotFoundException($request);
        }

        $bodyParams = $this->getBodyJsonAsArray($request);

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('id', new IsInt(minValue: 1, maxValue: 999999));
        $bodyValidator->addValidator('id', new RunnerIdIsNotUsed(existingRunnerId: $runnerId));
        $bodyValidator->addValidator('firstname', new IsString(maxLength: Runner::FIRSTNAME_MAX_LENGTH));
        $bodyValidator->addValidator('lastname', new IsString(maxLength: Runner::LASTNAME_MAX_LENGTH));
        $bodyValidator->addValidator('gender', new IsGenderString());
        $bodyValidator->addValidator('birthYear', new IsInt(minValue: 1900, maxValue: date("Y")));
        $bodyValidator->addValidator('raceId', new RaceIdExists());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        if (isset($bodyParams['id'])) {
            $runner = $this->updateRunnerId($runner, $bodyParams['id']);
        }

        $this->updateRunner($runner, $bodyParams);

        $runnerAsArray = $runnerRepository->findById($runner->getId(), asArray: true);

        // TODO optimize
        $runnerAsArray['raceId'] = $runnerRepository->findById($runner->getId())->getRace()->getId();

        $runnerAsArray['category'] = CommonUtil::getFfaCategoryFromBirthYear($runnerAsArray['birthYear']);

        $responseData = $runnerAsArray;

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }

    private function updateRunnerId(Runner $runner, int $newId): Runner
    {
        if ($newId === $runner->getId()) {
            return $runner;
        }

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->beginTransaction();

        // We need to create a new runner with the new ID in order to transfer its passages
        // without violating foreign key contraint

        $newRunner = new Runner();

        $newRunner->setId($newId);
        $newRunner->setFirstname($runner->getFirstname());
        $newRunner->setLastname($runner->getLastname());
        $newRunner->setGender($runner->getGender());
        $newRunner->setBirthYear($runner->getBirthYear());
        $newRunner->setRace($runner->getRace());

        $entityManager->persist($newRunner);
        $entityManager->flush();

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        $passageRepository->updateAllOfRunner($runner->getId(), $newRunner->getId());

        $entityManager->remove($runner);
        $entityManager->flush();

        $entityManager->commit();

        return $newRunner;
    }

    private function updateRunner(Runner $runner, array $bodyParams)
    {
        if (empty($bodyParams)) {
            return;
        }

        if (isset($bodyParams['firstname'])) {
            $runner->setFirstname($bodyParams['firstname']);
        }

        if (isset($bodyParams['lastname'])) {
            $runner->setLastname($bodyParams['lastname']);
        }

        if (isset($bodyParams['gender'])) {
            $runner->setGender($bodyParams['gender']);
        }

        if (isset($bodyParams['birthYear'])) {
            $runner->setBirthYear($bodyParams['birthYear']);
        }

        if (isset($bodyParams['raceId'])) {
            /** @var RaceRepository $raceRepository */
            $raceRepository = RepositoryProvider::getRepository(Race::class);

            $race = $raceRepository->findById($bodyParams['raceId']);

            $runner->setRace($race);
        }

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->persist($runner);
        $entityManager->flush();
    }
}
