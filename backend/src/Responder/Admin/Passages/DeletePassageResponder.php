<?php

namespace App\Responder\Admin\Passages;

use App\Database\Entity\Passage;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
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

        $passageId = $args['id'];

        if (!is_numeric($passageId)) {
            throw new HttpNotFoundException($request);
        }

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        $passage = $passageRepository->findById($passageId);

        if (is_null($passage)) {
            throw new HttpNotFoundException($request);
        }

        MainApp::getInstance()->getEntityManager()->remove($passage);
        MainApp::getInstance()->getEntityManager()->flush();

        return $response->withStatus(204);
    }
}
