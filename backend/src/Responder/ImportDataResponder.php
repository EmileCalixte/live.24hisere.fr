<?php

namespace App\Responder;

use App\Database\DAO;
use App\Database\DataLineSaver;
use App\MainApp;
use App\Misc\Util;
use App\Model\DataLine\DataLine;
use App\Model\DataLine\Exception\InvalidLineFormatException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpUnauthorizedException;

class ImportDataResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args)
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

        DAO::getInstance()->beginTransaction();

        try {
            DAO::getInstance()->deleteAllRunnerPassages();

            $dataLineSaver = new DataLineSaver();

            while (($line = fgets($handle)) !== false) {
                $dataLineSaver->saveDataLine(new DataLine($line));
            }

            DAO::getInstance()->commitTransaction();
        } catch (\Exception $e) {
            DAO::getInstance()->rollBackTransaction();
            throw $e;
        }

        fclose($handle);
    }
}
