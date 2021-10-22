<?php


namespace App\Responder;


use App\Database\DAO;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RunnersResponder implements ResponderInterface
{

    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $dbRunners = DAO::getInstance()->getRunners();

        $responseData = [
            'runners' => $dbRunners,
        ];

        Util::insertMetadataInResponseArray($responseData);
        Util::camelizeApiResponseFields($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return Util::getApiResponseWithHeaders($response);
    }
}
