<?php

namespace App\Responder;

use App\Database\DAO;
use App\Database\Entity\Passage;
use App\Database\Entity\Runner;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\Database\RunnerPassageDataLineSaver;
use App\MainApp;
use App\Misc\Util;
use App\Model\PassagesFileDataLine\DataLine;
use App\Model\PassagesFileDataLine\Exception\InvalidLineFormatException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpUnauthorizedException;

class ImportPassagesResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->handleAuthorization($request);

        try {
            $this->handleRequestBody($request);
        } catch (InvalidLineFormatException $e) {
            throw new HttpBadRequestException($request, $e->getMessage(), $e);
        }

        return $response;
    }

    /**
     * @param ServerRequestInterface $request The request
     * @throws HttpUnauthorizedException if request cannot be authorized
     */
    private function handleAuthorization(ServerRequestInterface $request)
    {
        $secretKey = MainApp::getInstance()->getConfig()->getImportDataSecretKey();

        $authorizationHeader = $request->getHeader('Authorization');

        if (empty($authorizationHeader)) {
            throw new HttpUnauthorizedException($request, "Authorization header is missing");
        }

        $headerSecretKey = $authorizationHeader[0];

        if ($headerSecretKey !== $secretKey) {
            throw new HttpUnauthorizedException($request, "Invalid credentials");
        }
    }

    /**
     * @param ServerRequestInterface $request
     * @throws InvalidLineFormatException if input data is malformed
     */
    private function handleRequestBody(ServerRequestInterface $request)
    {
        $tempFilePath = sys_get_temp_dir() . '/PHP_importDataBodyContent_' . str_replace('.', '', microtime(true)) . '.txt';

        try {
            Util::writeStreamInFile($request->getBody(), $tempFilePath);

            $this->handleDataTempFile($tempFilePath);
        } finally {
            unlink($tempFilePath);
        }
    }

    /**
     * @param string $filePath
     * @throws InvalidLineFormatException if file data is malformed
     */
    private function handleDataTempFile(string $filePath)
    {
        $handle = fopen($filePath, 'r');

        if ($handle === false) {
            throw new \RuntimeException('Cannot read file');
        }

        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        MainApp::getInstance()->getEntityManager()->beginTransaction();

        try {
            // TODO do not delete all passages, save new passages but keep existing ones
            $passageRepository->deleteAll();

            $dataLineSaver = new RunnerPassageDataLineSaver();

            while (($line = fgets($handle)) !== false) {
                $dataLine = new DataLine($line);

                $runner = $runnerRepository->findById($dataLine->getRunnerId());

                // If passage does not correspond to a known runner, ignore it
                if (is_null($runner)) {
                    continue;
                }

                $dataLineSaver->saveDataLine($dataLine);
            }

            DAO::getInstance()->setLastUpdateTime(new \DateTimeImmutable("now", new \DateTimeZone("Europe/Paris")));

            MainApp::getInstance()->getEntityManager()->commit();
        } catch (\Exception $e) {
            MainApp::getInstance()->getEntityManager()->rollback();
            throw $e;
        }

        fclose($handle);
    }
}
