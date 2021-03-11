<?php


namespace App;


use App\Router\Router;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;
use Slim\App;
use Slim\Exception\HttpException;
use Slim\Factory\AppFactory as SlimFactory;
use Throwable;

class MainApp
{
    private Router $router;

    private App $slim;

    public function __construct()
    {
        $this->slim = SlimFactory::create();
        $this->router = new Router($this->slim);

        $this->registerErrorMiddleware();
        $this->router->registerRoutes();
    }

    public function run()
    {
        $this->slim->run();
    }

    private function getErrorHandler(): callable
    {
        return function (
            ServerRequestInterface $request,
            Throwable $exception,
            bool $displayErrorDetails,
            bool $logErrors,
            bool $logErrorDetails,
            ?LoggerInterface $logger = null
        ) {
            $isHttpException = $exception instanceof HttpException;
            $defaultStatusCode = 500;

            $statusCode = $isHttpException ? $exception->getCode() : $defaultStatusCode;

            $payload = [
                'status' => $statusCode,
                'error' => $exception->getMessage(),
            ];

            if (true) { // TODO DEV MODE ONLY
                $payload['stackTrace'] = $exception->getTrace();
            }

            $jsonEncodedFlags = JSON_UNESCAPED_UNICODE;
            if (true) { // TODO DEV MODE ONLY
                $jsonEncodedFlags |= JSON_PRETTY_PRINT;
            }

            $response = $this->slim->getResponseFactory()->createResponse();
            $response->getBody()->write(
                json_encode($payload, $jsonEncodedFlags)
            );

            return $response
                ->withAddedHeader('Content-Type', 'application/json')
                ->withStatus($statusCode);
        };
    }

    private function registerErrorMiddleware()
    {
        $errorHandler = $this->getErrorHandler();
        $errorMiddleware = $this->slim->addErrorMiddleware(true/* TODO DEV MODE ONLY */, true, true);
        $errorMiddleware->setDefaultErrorHandler($errorHandler);
    }
}
