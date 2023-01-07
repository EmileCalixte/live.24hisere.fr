<?php

namespace App\Responder\Admin\Runners\Passages;

use App\Database\Entity\Passage;
use App\Database\Entity\Runner;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\MainApp;
use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class DeletePassageResponder extends AbstractResponder
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

        MainApp::getInstance()->getEntityManager()->remove($passage);
        MainApp::getInstance()->getEntityManager()->flush();

        return $response->withStatus(204);
    }
}
