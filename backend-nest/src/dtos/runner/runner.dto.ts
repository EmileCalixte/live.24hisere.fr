import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, Validate } from "class-validator";
import { RUNNER_FIRSTNAME_MAX_LENGTH, RUNNER_LASTNAME_MAX_LENGTH } from "../../constants/runner.constants";
import { RaceIdExistsRule } from "../../validation/rules/race/raceIdExists.rule";
import { RunnerIdDoesNotExistRule } from "../../validation/rules/runner/runnerIdDoesNotExist.rule";
import { IsGender } from "../../validation/validators/IsGender";

export class RunnerDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @Validate(RunnerIdDoesNotExistRule)
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
    gender: string;

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
