<?php

namespace App\Responder\Admin;

use App\Database\Entity\User;
use App\Database\Repository\RepositoryProvider;
use App\Misc\Util\CommonUtil;
use App\Responder\AbstractResponder;
use App\Security\Authentication\Authentication;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UsersResponder extends AbstractResponder
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $this->requireAuthentication($request);

        $userRepository = RepositoryProvider::getRepository(User::class);

        $users = $userRepository->findAll(asArray: true);

        $currentUser = Authentication::getInstance()->getUser();
        foreach ($users as &$user) {
            if ($user['id'] === $currentUser->getId()) {
                $user['isCurrentUser'] = true;
            } else {
                $user['isCurrentUser'] = false;
            }
        }

        $responseData = [
            'users' => $users,
        ];

        CommonUtil::camelizeArrayKeysRecursively($responseData);

        $response->getBody()->write(CommonUtil::jsonEncode($responseData));

        return $response;
    }
}
