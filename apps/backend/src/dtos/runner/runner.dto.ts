import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsISO31661Alpha3,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { RUNNER_FIRSTNAME_MAX_LENGTH, RUNNER_LASTNAME_MAX_LENGTH } from "@live24hisere/core/constants";
import { Gender, PostRunnerAdminApiRequest } from "@live24hisere/core/types";
import { IsGender } from "../../validation/validators/IsGender";

type PostRunnerPayload = PostRunnerAdminApiRequest["payload"];

export class RunnerDto implements PostRunnerPayload {
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

  @IsString()
  @IsOptional()
  @IsISO31661Alpha3()
  countryCode: string | null = null;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  // @IsBoolean()
  // @IsDefined()
  // stopped: boolean;

  // @IsInt()
  // @IsNotEmpty()
  // @Validate(RaceIdExistsRule)
  // raceId: number;
}
