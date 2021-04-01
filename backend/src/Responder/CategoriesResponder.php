<?php


namespace App\Responder;


use App\MainApp;
use App\Misc\Util;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class CategoriesResponder implements ResponderInterface
{
    /**
     * Ordered categories array
     */
    const AVAILABLE_CATEGORIES = [
        'ES' => 'Espoir',
        'SE' => 'Senior',
        'M0' => 'Master 0',
        'M1' => 'Master 1',
        'M2' => 'Master 2',
        'M3' => 'Master 3',
        'M4' => 'Master 4',
        'M5' => 'Master 5',
        'M6' => 'Master 6',
        'M7' => 'Master 7',
        'M8' => 'Master 8',
        'M9' => 'Master 9',
        'M10' => 'Master 10',

        // Old FFA categories
        'V1' => 'Vétéran 1',
        'V2' => 'Vétéran 2',
        'V3' => 'Vétéran 3',
        'V4' => 'Vétéran 4',
        'V5' => 'Vétéran 5',
    ];

    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
    {
        $dbCategories = MainApp::$app->getDb()->getCategories();

        $responseData = [
            'categories' => [],
        ];

        foreach (self::AVAILABLE_CATEGORIES as $categoryCode => $categoryName) {
            if (!in_array($categoryCode, $dbCategories)) {
                continue;
            }
            $responseData['categories'][$categoryCode] = $categoryName;
        }

        Util::insertMetadataInResponseArray($responseData);

        $response->getBody()->write(Util::jsonEncode($responseData));

        return Util::getApiResponseWithHeaders($response);
    }
}
