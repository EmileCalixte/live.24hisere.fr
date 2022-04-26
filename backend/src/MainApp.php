<?php


namespace App;


use App\Base\Singleton\Singleton;
use App\Config\Config;
use App\Database\DAO;
use App\Database\Entity\User;
use App\Log\AppLogger;
use App\Router\Router;
use App\Security\Authentication\AuthenticationMiddleware;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Log\LoggerInterface;
use Slim\App;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Factory\AppFactory as SlimFactory;
use Throwable;

class MainApp extends Singleton
{
    public static MainApp $app;

    public static string $rootDir;

    private Config $config;

    private EntityManager $entityManager;

    private Router $router;

    private App $slim;

    /**
     * @var User|null If a valid access token is provided in the request header, the corresponding user
     */
    private ?User $user = null;

    protected function __construct(bool $cli = false)
    {
        self::$rootDir = realpath(__DIR__ . '/..');

        parent::__construct();

        $this->config = new Config();

        DAO::getInstance()->initialize($this->getConfig()->getDbHost(), $this->getConfig()->getDbName(), $this->getConfig()->getDbUser(), $this->getConfig()->getDbPassword());

        $this->initializeEntityManager();

        if ($cli) {
            return;
        }

        $this->slim = SlimFactory::create();

        /** Authenticates {@see $user} from access token provided in request header */
        $this->slim->add(new AuthenticationMiddleware());

        $this->router = new Router($this->slim);

        $this->registerErrorMiddleware();
        $this->router->registerRoutes();

        $this->registerHeadersMiddleware();
    }

    public function getConfig(): Config
    {
        return $this->config;
    }

    public function getEntityManager(): EntityManager
    {
        return $this->entityManager;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user)
    {
        $this->user = $user;
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

            if (!$this->getConfig()->isDevMode() && !$isHttpException) {
                $exceptionToReturn = new HttpInternalServerErrorException($request, null, $exception);
            } else {
                $exceptionToReturn = $exception;
            }

            $payload = [
                'status' => $statusCode,
                'error' => $exceptionToReturn->getMessage(),
            ];

            if ($this->getConfig()->isDevMode()) {
                $payload['stackTrace'] = $exceptionToReturn->getTrace();
            }

            $jsonEncodedFlags = JSON_UNESCAPED_UNICODE;
            if ($this->getConfig()->isDevMode()) {
                $jsonEncodedFlags |= JSON_PRETTY_PRINT;
            }

            $response = $this->slim->getResponseFactory()->createResponse();
            $response->getBody()->write(
                json_encode($payload, $jsonEncodedFlags)
            );

            AppLogger::error($exceptionToReturn);

            return $response
                ->withAddedHeader('Content-Type', 'application/json')
                ->withStatus($statusCode);
        };
    }

    private function initializeEntityManager()
    {
        $connection = [
            'driver' => 'pdo_mysql',
            'host' => $this->getConfig()->getDbHost(),
            'dbname' => $this->getConfig()->getDbName(),
            'user' => $this->getConfig()->getDbUser(),
            'password' => $this->getConfig()->getDbPassword(),
            'charset' => $this->getConfig()->getDbCharset(),
        ];

        $config = ORMSetup::createAttributeMetadataConfiguration([__DIR__ . '/Database/Entity'], $this->getConfig()->isDevMode());

        $this->entityManager = EntityManager::create($connection, $config);
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
