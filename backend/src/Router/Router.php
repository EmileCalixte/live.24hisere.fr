<?php


namespace App\Router;


use App\Responder\Admin\DeleteUserAccessTokensResponder;
use App\Responder\Admin\Races\CreateRaceResponder;
use App\Responder\Admin\Races\DeleteRaceResponder;
use App\Responder\Admin\Races\RaceResponder;
use App\Responder\Admin\Races\RacesResponder;
use App\Responder\Admin\Races\UpdateRaceResponder;
use App\Responder\Admin\Races\UpdateRacesOrderResponder;
use App\Responder\Admin\UsersResponder;
use App\Responder\Auth\CurrentUserInfoResponder;
use App\Responder\Auth\LoginResponder;
use App\Responder\Auth\LogoutResponder;
use App\Responder\CategoriesResponder;
use App\Responder\RaceDataResponder;
use App\Responder\OptionsResponder;
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
        // When request is OPTIONS, always return 200 with CORS headers
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            $this->registerRoute($_SERVER['REQUEST_URI'], OptionsResponder::class, 'OPTIONS');
            return;
        }

        $this->registerRoute('/categories', CategoriesResponder::class, 'GET');
        $this->registerRoute('/race-data', RaceDataResponder::class, 'GET');
        $this->registerRoute('/ranking', RankingResponder::class, 'GET');
        $this->registerRoute('/runners', RunnersResponder::class, 'GET');
        $this->registerRoute('/runners/{id}', RunnerDetailsResponder::class, 'GET');

        $this->registerRoute('/auth/login', LoginResponder::class, 'POST');
        $this->registerRoute('/auth/logout', LogoutResponder::class, 'POST');
        $this->registerRoute('/auth/current-user-info', CurrentUserInfoResponder::class, 'GET');

        $this->registerRoute('/admin/races', RacesResponder::class, 'GET');
        $this->registerRoute('/admin/races', CreateRaceResponder::class, 'POST');
        $this->registerRoute('/admin/races/{id}', RaceResponder::class, 'GET');
        $this->registerRoute('/admin/races/{id}', UpdateRaceResponder::class, 'PATCH');
        $this->registerRoute('/admin/races/{id}', DeleteRaceResponder::class, 'DELETE');
        $this->registerRoute('/admin/races-order', UpdateRacesOrderResponder::class, 'PUT');

        $this->registerRoute('/admin/users', UsersResponder::class, 'GET');
        $this->registerRoute('/admin/users/{id}/access-tokens', DeleteUserAccessTokensResponder::class, 'DELETE');
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
