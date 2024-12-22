import { IsBoolean, IsInt, IsNotEmpty, Validate } from "class-validator";
import { PostPassageAdminApiRequest } from "@live24hisere/core/types";
import { RaceIdExistsRule } from "../../validation/rules/race/raceIdExists.rule";
import { RunnerIdExistsRule } from "../../validation/rules/runner/runnerIdExists.rule";
import { IsISO8601UTCDateString } from "../../validation/validators/IsISO8601UTCDateString";

type PostPassagePayload = PostPassageAdminApiRequest["payload"];

export class PassageDto implements PostPassagePayload {
  @IsInt()
  @IsNotEmpty()
  @Validate(RaceIdExistsRule)
  raceId: number;

  @IsInt()
  @IsNotEmpty()
  @Validate(RunnerIdExistsRule)
  runnerId: number;

  @IsBoolean()
  @IsNotEmpty()
  isHidden: boolean;

  @IsISO8601UTCDateString()
  @IsNotEmpty()
  time: string;
}
