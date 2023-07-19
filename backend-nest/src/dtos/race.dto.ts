import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString, Max,
    MaxLength,
    Min,
    Validate,
} from "class-validator";
import { RACE_MAX_DISTANCE, RACE_MAX_DURATION, RACE_NAME_MAX_LENGTH } from "../constants/race.constants";
import { RaceNameDoesNotExistRule } from "../validation/rules/race/raceNameDoesNotExist.rule";
import { IsISO8601UTCDateString } from "../validation/validators/IsISO8601UTCDateString";

export class RaceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(RACE_NAME_MAX_LENGTH)
    @Validate(RaceNameDoesNotExistRule)
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean;

    @IsNotEmpty()
    @IsISO8601UTCDateString()
    startTime: Date;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(RACE_MAX_DURATION)
    duration: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(RACE_MAX_DISTANCE)
    initialDistance: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(RACE_MAX_DISTANCE)
    lapDistance: number;
}
