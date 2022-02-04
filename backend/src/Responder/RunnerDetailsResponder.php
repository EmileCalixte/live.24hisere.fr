<?php


namespace App\Responder;


use App\Database\DAO;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class RunnerDetailsResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $runnerId = $args['id'];

        $dbRunner = DAO::getInstance()->getRunner($runnerId);

        if ($dbRunner === false) {
            throw new HttpNotFoundException($request);
        }

        $dbPassages = DAO::getInstance()->getRunnerPassages($runnerId);

        $responseData = [
            'runner' => $dbRunner + ['passages' => $dbPassages],
        ];

        Util::insertMetadataInResponseArray($responseData);
        Util::camelizeApiResponseFields($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return $response;
    }
}
