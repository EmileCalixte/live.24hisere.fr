<?php


namespace App;


use App\Base\Singleton\Singleton;
use App\Config\Config;
use App\Database\DAO;
use App\Router\Router;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Log\LoggerInterface;
use Slim\App;
use Slim\Exception\HttpException;
use Slim\Factory\AppFactory as SlimFactory;
use Throwable;

class MainApp extends Singleton
{
    public static MainApp $app;

    private Config $config;

    private Router $router;

    private App $slim;

    protected function __construct()
    {
        parent::__construct();

        $this->config = new Config();

        DAO::getInstance()->initialize($this->getConfig()->getDbHost(), $this->getConfig()->getDbName(), $this->getConfig()->getDbUser(), $this->getConfig()->getDbPassword());

        $this->slim = SlimFactory::create();
        $this->router = new Router($this->slim);

        $this->registerErrorMiddleware();
        $this->router->registerRoutes();

        $this->registerHeadersMiddleware();
    }

    public function getConfig(): Config
    {
        return $this->config;
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

            if ($this->getConfig()->isDevMode()) {
                $payload['stackTrace'] = $exception->getTrace();
            }

            $jsonEncodedFlags = JSON_UNESCAPED_UNICODE;
            if ($this->getConfig()->isDevMode()) {
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
        $errorMiddleware = $this->slim->addErrorMiddleware($this->getConfig()->isDevMode(), true, true);
        $errorMiddleware->setDefaultErrorHandler($errorHandler);
    }

    private function registerHeadersMiddleware()
    {
        // Add CORS & Content-Type headers to every response

        $this->slim->add(function (RequestInterface $req, RequestHandlerInterface $handler) {
            $response = $handler->handle($req);
            return $response
                ->withHeader('Access-Control-Allow-Origin', $this->getConfig()->isDevMode() ? '*' : $this->getConfig()->getFrontendUrl())
                ->withHeader('Content-Type', 'application/json');
        });
    }
}
