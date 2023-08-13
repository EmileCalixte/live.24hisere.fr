<?php

use App\Misc\Util\DateUtil;
use PHPUnit\Framework\TestCase;

class DateUtilTest extends TestCase
{
    public function testConvertDatabaseDateToDatetime()
    {
        $dateStringWithMilliseconds = "2022-03-31 16:27:12.159";
        $dateStringWithoutMilliseconds = "2022-03-31 16:27:12";

        /* WITH MILLISECONDS */

        $actualDateTimeImmutableWithMilliseconds = DateUtil::convertDatabaseDateToDate($dateStringWithMilliseconds);
        $actualDateTimeWithMilliseconds = DateUtil::convertDatabaseDateToDate($dateStringWithMilliseconds, immutable: false);

        /** IMMUTABLE */

        $this->assertInstanceOf(DateTimeImmutable::class, $actualDateTimeImmutableWithMilliseconds);
        $this->assertEquals("2022", $actualDateTimeWithMilliseconds->format("Y"));
        $this->assertEquals("03", $actualDateTimeWithMilliseconds->format("m"));
        $this->assertEquals("31", $actualDateTimeWithMilliseconds->format("d"));
        $this->assertEquals("16", $actualDateTimeWithMilliseconds->format("H"));
        $this->assertEquals("27", $actualDateTimeWithMilliseconds->format("i"));
        $this->assertEquals("12", $actualDateTimeWithMilliseconds->format("s"));
        $this->assertEquals("159", $actualDateTimeWithMilliseconds->format("v"));

        /** MUTABLE */

        $this->assertInstanceOf(DateTime::class, $actualDateTimeWithMilliseconds);
        $this->assertEquals("2022", $actualDateTimeWithMilliseconds->format("Y"));
        $this->assertEquals("03", $actualDateTimeWithMilliseconds->format("m"));
        $this->assertEquals("31", $actualDateTimeWithMilliseconds->format("d"));
        $this->assertEquals("16", $actualDateTimeWithMilliseconds->format("H"));
        $this->assertEquals("27", $actualDateTimeWithMilliseconds->format("i"));
        $this->assertEquals("12", $actualDateTimeWithMilliseconds->format("s"));
        $this->assertEquals("159", $actualDateTimeWithMilliseconds->format("v"));

        /* WITHOUT MILLISECONDS */

        $actualDateTimeImmutableWithoutMilliseconds = DateUtil::convertDatabaseDateToDate($dateStringWithoutMilliseconds, withMilliseconds: false);
        $actualDateTimeWithoutMilliseconds = DateUtil::convertDatabaseDateToDate($dateStringWithoutMilliseconds, withMilliseconds: false, immutable: false);

        /** IMMUTABLE */

        $this->assertInstanceOf(DateTimeImmutable::class, $actualDateTimeImmutableWithoutMilliseconds);
        $this->assertEquals("2022", $actualDateTimeImmutableWithoutMilliseconds->format("Y"));
        $this->assertEquals("03", $actualDateTimeImmutableWithoutMilliseconds->format("m"));
        $this->assertEquals("31", $actualDateTimeImmutableWithoutMilliseconds->format("d"));
        $this->assertEquals("16", $actualDateTimeImmutableWithoutMilliseconds->format("H"));
        $this->assertEquals("27", $actualDateTimeImmutableWithoutMilliseconds->format("i"));
        $this->assertEquals("12", $actualDateTimeImmutableWithoutMilliseconds->format("s"));
        $this->assertEquals("000", $actualDateTimeImmutableWithoutMilliseconds->format("v"));

        /** MUTABLE */

        $this->assertInstanceOf(DateTime::class, $actualDateTimeWithoutMilliseconds);
        $this->assertEquals("2022", $actualDateTimeWithoutMilliseconds->format("Y"));
        $this->assertEquals("03", $actualDateTimeWithoutMilliseconds->format("m"));
        $this->assertEquals("31", $actualDateTimeWithoutMilliseconds->format("d"));
        $this->assertEquals("16", $actualDateTimeWithoutMilliseconds->format("H"));
        $this->assertEquals("27", $actualDateTimeWithoutMilliseconds->format("i"));
        $this->assertEquals("12", $actualDateTimeWithoutMilliseconds->format("s"));
        $this->assertEquals("000", $actualDateTimeWithoutMilliseconds->format("v"));
    }

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
