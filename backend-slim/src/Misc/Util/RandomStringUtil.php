<?php

namespace App\Misc\Util;

class RandomStringUtil
{
    public const RANDOM_STRING_ALPHABET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    public const RANDOM_STRING_ALPHABET_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    public const RANDOM_STRING_NUMERIC = '0123456789';
    public const RANDOM_STRING_HEXADECIMAL = '0123456789abcdef';
    public const RANDOM_STRING_ALPHABET_ALL_CASE = self::RANDOM_STRING_ALPHABET_LOWERCASE . self::RANDOM_STRING_ALPHABET_UPPERCASE;
    public const RANDOM_STRING_ALPHANUMERIC_ALL_CASE = self::RANDOM_STRING_ALPHABET_ALL_CASE . self::RANDOM_STRING_NUMERIC;
    public const RANDOM_STRING_ALPHANUMERIC_UPPERCASE = self::RANDOM_STRING_ALPHABET_UPPERCASE . self::RANDOM_STRING_NUMERIC;

    public static function getRandomString(int $length, string $characters = self::RANDOM_STRING_ALPHANUMERIC_ALL_CASE)
    {
        $generatedCharacters = [];

        for ($i = 0; $i < $length; ++$i) {
            $generatedCharacters[] = $characters[random_int(0, mb_strlen($characters)-1)];
        }

        return implode('', $generatedCharacters);
    }
}
