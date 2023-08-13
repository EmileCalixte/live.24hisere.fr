<?php

namespace App\Responder\Admin\Runners\Passages;

use App\Database\Entity\Passage;
use App\Database\Entity\Runner;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\MainApp;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use App\Responder\AbstractResponder;
use App\Validator\ArrayValidator;
use App\Validator\PropertyValidator\IsRequired;
use App\Validator\PropertyValidator\TypeValidator\IsBool;
use App\Validator\PropertyValidator\TypeValidator\IsDateString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class CreatePassageResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $runnerId = $args['runnerId'];

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
        $bodyValidator->addValidator('isHidden', new IsRequired());
        $bodyValidator->addValidator('isHidden', new IsBool());
        $bodyValidator->addValidator('time', new IsRequired());
        $bodyValidator->addValidator('time', new IsDateString());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        $passage = new Passage();
        $passage->setRunner($runner);
        $passage->setDetectionId(null);
        $passage->setTime(DateUtil::convertJavascriptDateToDate(
            $bodyParams['time'],
            withMilliseconds: false,
            immutable: false,
        ));
        $passage->setIsHidden($bodyParams['isHidden']);

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->persist($passage);
        $entityManager->flush();

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        $passageAsArray = $passageRepository->findById($passage->getId(), asArray: true);

        $passageAsArray['time'] = DateUtil::convertDateToJavascriptDate($passageAsArray['time']);

        $responseData = $passageAsArray;

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response->withStatus(201);
    }
}
