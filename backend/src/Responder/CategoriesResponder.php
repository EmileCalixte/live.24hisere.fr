<?php


namespace App\Responder;


use App\Database\Entity\Runner;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Misc\Util\CommonUtil;
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

    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $dbCategories = $runnerRepository->getCategories();

        $responseData = [
            'categories' => [],
        ];

        foreach (self::AVAILABLE_CATEGORIES as $categoryCode => $categoryName) {
            if (!in_array($categoryCode, $dbCategories)) {
                continue;
            }
            $responseData['categories'][] = [
                'code' => $categoryCode,
                'name' => $categoryName,
            ];
        }

        CommonUtil::insertMetadataInResponseArray($responseData);
        CommonUtil::camelizeApiResponseFields($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
