import {
    IsBoolean,
    IsDefined,
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    MaxLength,
    Min,
    Validate,
} from "class-validator";
import { Gender } from "@live24hisere/types";
import {
    RUNNER_FIRSTNAME_MAX_LENGTH,
    RUNNER_LASTNAME_MAX_LENGTH,
} from "../../constants/runner.constants";
import { RaceIdExistsRule } from "../../validation/rules/race/raceIdExists.rule";
import { IsGender } from "../../validation/validators/IsGender";

export class RunnerDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(RUNNER_FIRSTNAME_MAX_LENGTH)
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(RUNNER_LASTNAME_MAX_LENGTH)
    lastname: string;

    @IsGender()
    @IsNotEmpty()
    gender: Gender;

    @IsInt()
    @IsNotEmpty()
    @Min(1900)
    @Max(new Date().getFullYear())
    birthYear: number;

    @IsBoolean()
    @IsDefined()
    stopped: boolean;

    @IsInt()
    @IsNotEmpty()
    @Validate(RaceIdExistsRule)
    raceId: number;
}
