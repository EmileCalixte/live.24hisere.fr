import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, Validate } from "class-validator";
import { RUNNER_FIRSTNAME_MAX_LENGTH, RUNNER_LASTNAME_MAX_LENGTH } from "../../constants/runner.constants";
import { type Gender } from "../../types/Gender";
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

    @IsInt()
    @IsNotEmpty()
    @Validate(RaceIdExistsRule)
    raceId: number;
}
