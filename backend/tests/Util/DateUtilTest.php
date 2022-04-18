<?php

use App\Misc\Util\DateUtil;
use PHPUnit\Framework\TestCase;

class DateUtilTest extends TestCase
{
    public function testConvertDatetimeToJsDate()
    {
        $date = DateTime::createFromFormat("Y-m-d H:i:s.v", "2022-03-31 16:27:12.159");

        $expectedWithMilliseconds = "2022-03-31T16:27:12.159";
        $actualWithMilliseconds = DateUtil::convertDateToJavascriptDate($date);

        $this->assertIsString($actualWithMilliseconds);
        $this->assertEquals($expectedWithMilliseconds, $actualWithMilliseconds);

        $expectedWithoutMilliseconds = "2022-03-31T16:27:12";
        $actualWithoutMilliseconds = DateUtil::convertDateToJavascriptDate($date, withMilliseconds: false);

        $this->assertIsString($actualWithoutMilliseconds);
        $this->assertEquals($expectedWithoutMilliseconds, $actualWithoutMilliseconds);
    }

    public function testConvertJsDateToDatetime()
    {
        $jsDateWithMilliseconds = "2022-03-31T16:27:12.159";
        $jsDateWithoutMilliseconds = "2022-03-31T16:27:12";

        /* WITH MILLISECONDS */

        $expectedDateTimeWithMilliseconds = DateTime::createFromFormat("Y-m-d H:i:s.v", "2022-03-31 16:27:12.159");
        $actualDateTimeWithMilliseconds = DateUtil::convertJavascriptDateToDate($jsDateWithMilliseconds, immutable: false);

        $this->assertInstanceOf(DateTime::class, $actualDateTimeWithMilliseconds);
        $this->assertEquals($expectedDateTimeWithMilliseconds, $actualDateTimeWithMilliseconds);

        $expectedDateTimeImmutableWithMilliseconds = DateTimeImmutable::createFromFormat("Y-m-d H:i:s.v", "2022-03-31 16:27:12.159");
        $actualDateTimeImmutableWithMilliseconds = DateUtil::convertJavascriptDateToDate($jsDateWithMilliseconds);

        $this->assertInstanceOf(DateTimeImmutable::class, $expectedDateTimeImmutableWithMilliseconds);
        $this->assertEquals($expectedDateTimeImmutableWithMilliseconds, $actualDateTimeImmutableWithMilliseconds);

        /* WITHOUT MILLISECONDS */

        $expectedDateTimeWithoutMilliseconds = DateTime::createFromFormat("Y-m-d H:i:s", "2022-03-31 16:27:12");
        $actualDateTimeWithoutMilliseconds = DateUtil::convertJavascriptDateToDate($jsDateWithoutMilliseconds, withMilliseconds: false, immutable: false);

        $this->assertInstanceOf(DateTime::class, $actualDateTimeWithoutMilliseconds);
        $this->assertEquals($expectedDateTimeWithoutMilliseconds, $actualDateTimeWithoutMilliseconds);

        $expectedDateTimeImmutableWitouthMilliseconds = DateTimeImmutable::createFromFormat("Y-m-d H:i:s", "2022-03-31 16:27:12");
        $actualDateTimeImmutableWithoutMilliseconds = DateUtil::convertJavascriptDateToDate($jsDateWithoutMilliseconds, withMilliseconds: false);

        $this->assertInstanceOf(DateTimeImmutable::class, $actualDateTimeImmutableWithoutMilliseconds);
        $this->assertEquals($expectedDateTimeImmutableWitouthMilliseconds, $actualDateTimeImmutableWithoutMilliseconds);
    }

    public function testConvertDatetimeToDatabaseDate()
    {
        $date = DateTime::createFromFormat("Y-m-d H:i:s.v", "2022-03-31 16:27:12.159");

        $expected = "2022-03-31 16:27:12";
        $actual = DateUtil::convertDateToDatabaseDate($date);

        $this->assertIsString($actual);
        $this->assertEquals($expected, $actual);
    }

    public function testConvertDatabaseDateToJsDate()
    {
        $databaseDateWithMilliseconds = "2022-03-31 16:27:12.159";
        $databaseDateWithoutMilliseconds = "2022-03-31 16:27:12";

        $expectedWithMilliseconds = "2022-03-31T16:27:12.159";
        $actualWithMilliseconds = DateUtil::convertDatabaseDateToJavascriptDate($databaseDateWithMilliseconds);

        $this->assertIsString($actualWithMilliseconds);
        $this->assertEquals($expectedWithMilliseconds, $actualWithMilliseconds);

        $expectedWithoutMilliseconds = "2022-03-31T16:27:12";
        $actualWithoutMilliseconds = DateUtil::convertDatabaseDateToJavascriptDate($databaseDateWithoutMilliseconds, withMilliseconds: false);

        $this->assertIsString($actualWithoutMilliseconds);
        $this->assertEquals($expectedWithoutMilliseconds, $actualWithoutMilliseconds);
    }
}
