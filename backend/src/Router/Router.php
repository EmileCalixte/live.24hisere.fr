<?php


namespace App\Router;


use App\Responder\CategoriesResponder;
use App\Responder\ImportPassagesResponder;
use App\Responder\InitialDataResponder;
use App\Responder\RankingResponder;
use App\Responder\ResponderInterface;
use App\Responder\RunnerDetailsResponder;
use App\Responder\RunnersResponder;
use Slim\App;
use Slim\Interfaces\RouteInterface;

class Router
{
    private $responderRespondFunction = 'respond';

    public function __construct(
        private App $slim
    ) {}

    public function registerRoutes()
    {
        $this->registerRoute('/categories', CategoriesResponder::class, 'GET');
        $this->registerRoute('/import-passages', ImportPassagesResponder::class, 'POST');
        $this->registerRoute('/initial-data', InitialDataResponder::class, 'GET');
        $this->registerRoute('/ranking', RankingResponder::class, 'GET');
        $this->registerRoute('/runners', RunnersResponder::class, 'GET');
        $this->registerRoute('/runners/{id}', RunnerDetailsResponder::class, 'GET');
    }

    private function registerRoute(string $uri, string $responderClass, array|string $methods = null): RouteInterface
    {
        try {
            $responderClassReflection = new \ReflectionClass($responderClass);

            if (!$responderClassReflection->implementsInterface(ResponderInterface::class)) {
                throw new \InvalidArgumentException('Responder Class must implement interface ' . ResponderInterface::class);
            }
        } catch (\InvalidArgumentException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new \InvalidArgumentException($e->getMessage(), $e->getCode(), $e);
        }

        $callable = $responderClass . ':' . $this->responderRespondFunction;

        if (is_null($methods)) {
            return $this->slim->any($uri, $callable);
        }

        if (is_string($methods)) {
            $methods = [$methods];
        }

        return $this->slim->map($methods, $uri, $callable);
    }
}
