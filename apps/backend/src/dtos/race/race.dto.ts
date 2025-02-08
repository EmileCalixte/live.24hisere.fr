import { IsBoolean, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, Validate } from "class-validator";
import { RACE_MAX_DISTANCE, RACE_MAX_DURATION, RACE_NAME_MAX_LENGTH } from "@live24hisere/core/constants";
import { PostRaceAdminApiRequest } from "@live24hisere/core/types";
import { EditionIdExistsRule } from "../../validation/rules/edition/editionIdExists.rule";
import { FloatStringMax } from "../../validation/validators/floatString/FloatStringMax";
import { FloatStringMin } from "../../validation/validators/floatString/FloatStringMin";
import { IsFloatString } from "../../validation/validators/floatString/IsFloatString";
import { IsISO8601UTCDateString } from "../../validation/validators/IsISO8601UTCDateString";

type PostRacePayload = PostRaceAdminApiRequest["payload"];

export class RaceDto implements PostRacePayload {
  @IsInt()
  @IsNotEmpty()
  @Validate(EditionIdExistsRule)
  editionId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(RACE_NAME_MAX_LENGTH)
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsISO8601UTCDateString()
  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(RACE_MAX_DURATION)
  duration: number;

  @IsNotEmpty()
  @IsFloatString()
  @FloatStringMin(0)
  @FloatStringMax(RACE_MAX_DISTANCE)
  initialDistance: string;

  @IsNotEmpty()
  @IsFloatString()
  @FloatStringMin(0)
  @FloatStringMax(RACE_MAX_DISTANCE)
  lapDistance: string;

  @IsBoolean()
  @IsNotEmpty()
  isBasicRanking: boolean;
}
