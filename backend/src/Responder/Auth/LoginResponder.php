<?php

namespace App\Responder\Auth;

use App\Database\Entity\User;
use App\Database\Repository\UserRepository;
use App\MainApp;
use App\Misc\Util\CommonUtil;
use App\Misc\Util\PasswordUtil;
use App\Responder\ResponderInterface;
use App\Validator\ArrayValidator;
use App\Validator\PropertyValidator\IsRequired;
use App\Validator\PropertyValidator\IsString;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpForbiddenException;

class LoginResponder implements ResponderInterface
{
    public function respond(ServerRequestInterface $request, ResponseInterface $response, $args): ResponseInterface
    {
        $bodyParams = $request->getParsedBody();

        if (!is_array($bodyParams)) {
            throw new HttpBadRequestException($request);
        }

        $bodyValidator = new ArrayValidator($bodyParams);
        $bodyValidator->addValidator('username', new IsRequired());
        $bodyValidator->addValidator('username', new IsString());
        $bodyValidator->addValidator('password', new IsRequired());
        $bodyValidator->addValidator('password', new IsString());

        $areParamsValid = $bodyValidator->validate();

        if (!$areParamsValid) {
            $responseData = [
                'errors' => $bodyValidator->getErrors(),
            ];

            $response->getBody()->write(CommonUtil::jsonEncode($responseData));

            return $response->withStatus(422);
        }

        $user = $this->authenticateUser($bodyParams['username'], $bodyParams['password']);

        if (is_null($user)) {
            throw new HttpForbiddenException($request, "Invalid credentials");
        }

        // TODO generate and return access token
        $response->getBody()->write("TODO");
        return $response;
    }

    private function authenticateUser(string $username, string $password): ?User
    {
        $entityManager = MainApp::getInstance()->getEntityManager();

        /** @var UserRepository $userRepository */
        $userRepository = $entityManager->getRepository(User::class);

        $user = $userRepository->findByUsername(trim($username));

        if (is_null($user)) {
            return null;
        }

        $isPasswordOk = PasswordUtil::verifyPassword($password, $user->getPasswordHash());

        if (!$isPasswordOk) {
            return null;
        }

        return $user;
    }
}
