<?php

namespace App\Misc\Util;

class PasswordUtil
{
    public static function getPasswordHash(string $password): string
    {
        return password_hash($password, PASSWORD_ARGON2ID);
    }

    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}
