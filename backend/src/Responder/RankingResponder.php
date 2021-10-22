<?php


namespace App\Responder;


use App\Database\DAO;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RankingResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $at = null;

        if(isset($_GET['at'])) {
            if(\DateTime::createFromFormat('Y-m-d H:i:s', $_GET['at'])) {
                $at = $_GET['at'];
            }
        }

        $dbRanking = DAO::getInstance()->getRanking($at);

        $responseData = [
            'ranking' => $dbRanking,
        ];

        Util::insertMetadataInResponseArray($responseData);
        Util::camelizeApiResponseFields($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return Util::getApiResponseWithHeaders($response);
    }
}
