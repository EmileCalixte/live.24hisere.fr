<?php

namespace App\Responder\Admin\RaceSettings;

use App\MainApp;
use App\Misc\Util\CommonUtil;
use App\Responder\AbstractResponder;
use App\Validator\ArrayValidator;
use App\Validator\PropertyValidator\TypeValidator\IsDateString;
use App\Validator\PropertyValidator\TypeValidator\IsFloat;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UpdateRaceSettingsResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $bodyParams = $this->getBodyJsonAsArray($request);

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('raceStartTime', new IsDateString('Y-m-d\TH:i:s'));
        $bodyValidator->addValidator('firstLapDistance', new IsFloat());
        $bodyValidator->addValidator('lapDistance', new IsFloat());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        // TODO delete this function and use entities
        $this->saveSettings($bodyParams);

        $data = CommonUtil::getRaceData(false);

        $response->getBody()->write(CommonUtil::jsonEncode($data));

        return $response;
    }

    // This function will be deleted when the misc table is no longer used for race settings
    private function saveSettings($bodyParams)
    {
        $dbConnection = MainApp::getInstance()->getEntityManager()->getConnection();

        if (isset($bodyParams['raceStartTime'])) {
            $date = \DateTime::createFromFormat('Y-m-d\TH:i:s', $bodyParams['raceStartTime']);

            $sql = "UPDATE misc SET `value` = :value WHERE `key` = 'race_start_time'";
            $stmt = $dbConnection->prepare($sql);
            $stmt->bindValue(':value', $date->format('Y-m-d H:i:s'));
            $stmt->executeStatement();
        }

        if (isset($bodyParams['firstLapDistance'])) {
            $sql = "UPDATE misc SET `value` = :value WHERE `key` = 'first_lap_distance'";
            $stmt = $dbConnection->prepare($sql);
            $stmt->bindValue(':value', $bodyParams['firstLapDistance']);
            $stmt->executeStatement();
        }

        if (isset($bodyParams['lapDistance'])) {
            $sql = "UPDATE misc SET `value` = :value WHERE `key` = 'lap_distance'";
            $stmt = $dbConnection->prepare($sql);
            $stmt->bindValue(':value', $bodyParams['lapDistance']);
            $stmt->executeStatement();
        }
    }
}
