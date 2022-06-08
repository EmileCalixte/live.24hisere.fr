<?php

namespace App\Responder\Admin;

use App\Database\Entity\AccessToken;
use App\Database\Entity\User;
use App\Database\Repository\AccessTokenRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\UserRepository;
use App\Responder\AbstractResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

class DeleteUserAccessTokensResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $userId = $args['id'];

        /** @var UserRepository $userRepository */
        $userRepository = RepositoryProvider::getRepository(User::class);

        $user = $userRepository->findById($userId);

        if (is_null($user)) {
            throw new HttpNotFoundException($request, "User not found");
        }

        /** @var AccessTokenRepository $accessTokenRepository */
        $accessTokenRepository = RepositoryProvider::getRepository(AccessToken::class);

        $accessTokenRepository->deleteAllOfUser($user);

        return $response->withStatus(204);
    }
}
