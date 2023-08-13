<?php

use App\Misc\Util\CommonUtil;
use PHPUnit\Framework\TestCase;

class CommonUtilTest extends TestCase
{
    public function testCamelizeArrayKeysRecursively()
    {
        $snakeCaseKeysArray = [
            'first_key' => 1,
            'snake_case_value',
            'second_key' => [
                'a_sub_key' => 2,
                'another_sub_key' => [
                    'a_sub_sub_key' => 3,
                ],
            ],
        ];

        $expectedCamelCaseKeysArray = [
            'firstKey' => 1,
            'snake_case_value',
            'secondKey' => [
                'aSubKey' => 2,
                'anotherSubKey' => [
                    'aSubSubKey' => 3,
                ],
            ],
        ];

        $actualCamelCaseKeysArray = $snakeCaseKeysArray;

        CommonUtil::camelizeArrayKeysRecursively($actualCamelCaseKeysArray);

        $this->assertEquals($expectedCamelCaseKeysArray, $actualCamelCaseKeysArray);
    }
}
