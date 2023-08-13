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
use App\Validator\PropertyValidator\TypeValidator\IsBool;
use App\Validator\PropertyValidator\TypeValidator\IsDateString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class UpdatePassageResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $runnerId = $args['runnerId'];
        $passageId = $args['id'];

        if (!is_numeric($runnerId)) {
            throw new HttpNotFoundException($request);
        }

        if (!is_numeric($passageId)) {
            throw new HttpNotFoundException($request);
        }

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        $runner = $runnerRepository->findById($runnerId);

        if (is_null($runner)) {
            throw new HttpNotFoundException($request);
        }

        $passage = $passageRepository->findById($passageId);

        if (is_null($passage)) {
            throw new HttpNotFoundException($request);
        }

        if ($passage->getRunner()->getId() !== $runner->getId()) {
            throw new HttpNotFoundException($request);
        }

        $bodyParams = $this->getBodyJsonAsArray($request);

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('isHidden', new IsBool());
        $bodyValidator->addValidator('time', new IsDateString());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        $this->updatePassage($passage, $bodyParams);

        $passageAsArray = $passageRepository->findById($passage->getId(), asArray: true);

        $passageAsArray['time'] = DateUtil::convertDateToJavascriptDate($passageAsArray['time']);

        $responseData = $passageAsArray;

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }

    private function updatePassage(Passage $passage, array $bodyParams)
    {
        if (empty($bodyParams)) {
            return;
        }

        if (isset($bodyParams['isHidden'])) {
            $passage->setIsHidden($bodyParams['isHidden']);
        }

        if (isset($bodyParams['time'])) {
            $passage->setTime(DateUtil::convertJavascriptDateToDate(
                $bodyParams['time'],
                withMilliseconds: false,
                immutable: false,
            ));
        }

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->persist($passage);
        $entityManager->flush();
    }
}
