<?php

namespace App\Responder\Admin\Passages;

use App\Database\Entity\Passage;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\DateUtil;
use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class PassagesResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $excludeHidden = isset($_GET['excludeHidden']);

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        $passages = $passageRepository->findAll(includeHidden: !$excludeHidden);

        $responseData = [
            'passages' => array_map(function (Passage $passage) {
                return [
                    'id' => $passage->getId(),
                    'runnerId' => $passage->getRunner()->getId(),
                    'detectionId' => $passage->getDetectionId(),
                    'time' => DateUtil::convertDateToJavascriptDate($passage->getTime()),
                    'isHidden' => $passage->isHidden(),
                ];
            }, $passages),
        ];

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
