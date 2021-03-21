<?php


namespace App\Responder;


use App\MainApp;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class RunnersResponder implements ResponderInterface
{

    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $dbRunners = MainApp::$app->getDb()->getRunners();

        $responseData = [
            'runners' => $dbRunners,
        ];

        Util::insertMetadataInResponseArray($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return $response
            ->withHeader('Content-Type', 'application/json');
    }
}
