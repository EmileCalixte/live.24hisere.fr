<?php

use App\Misc\Util\PasswordUtil;
use PHPUnit\Framework\TestCase;

class PasswordUtilTest extends TestCase
{
    public function testVerifyPassword()
    {
        $correctPassword = 'myAwesomePassword';
        $wrongPassword = 'wrongPassword';
        $hash = '$argon2id$v=19$m=65536,t=4,p=1$cFd1V1VmajNsWVZnaFdRTA$cSDgyMH6h52EM1yj/GcAgZZrxw48nOj1b6bVvXmqf6c';

        $this->assertTrue(PasswordUtil::verifyPassword($correctPassword, $hash));
        $this->assertFalse(PasswordUtil::verifyPassword($wrongPassword, $hash));
    }

    public function testHashAndVerify()
    {
        $password = 'myAwesomePassword';

        $hash = PasswordUtil::getPasswordHash($password);

        $this->assertIsString($hash);

        $this->assertTrue(PasswordUtil::verifyPassword($password, $hash));
        $this->assertFalse(PasswordUtil::verifyPassword('anotherPassword', $hash));
    }
}
