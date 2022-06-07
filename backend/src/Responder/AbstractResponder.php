<?php

namespace App\Responder;

use Psr\Http\Message\ServerRequestInterface;

abstract class AbstractResponder implements ResponderInterface
{
    protected function requireAuthentication(ServerRequestInterface $request) {
        // TODO throw exception if user is not authenticated
    }
}
