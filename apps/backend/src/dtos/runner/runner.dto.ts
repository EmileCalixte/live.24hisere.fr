import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, Validate } from "class-validator";
import { RUNNER_FIRSTNAME_MAX_LENGTH, RUNNER_LASTNAME_MAX_LENGTH } from "@live24hisere/core/constants";
import { Gender, PostRunnerAdminApiRequest } from "@live24hisere/core/types";
import { RaceIdExistsRule } from "../../validation/rules/race/raceIdExists.rule";
import { IsGender } from "../../validation/validators/IsGender";

type PostRunnerPayload = PostRunnerAdminApiRequest["payload"];

export class RunnerDto implements PostRunnerPayload {
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
  @Type(() => Number) // Allow input to be a string and convert it to number with the `Number` constructor
  birthYear: number;

  @IsBoolean()
  @IsDefined()
  stopped: boolean;

  @IsInt()
  @IsNotEmpty()
  @Validate(RaceIdExistsRule)
  raceId: number;
}
