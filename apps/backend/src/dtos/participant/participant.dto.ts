import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min, Validate } from "class-validator";
import { RACE_MAX_DISTANCE } from "@live24hisere/core/constants";
import { PostParticipantAdminApiRequest } from "@live24hisere/core/types";
import { CustomRunnerCategoryIdExistsRule } from "../../validation/rules/customRunnerCategory/customRunnerCategoryIdExists.rule";
import { RunnerIdExistsRule } from "../../validation/rules/runner/runnerIdExists.rule";
import { FloatStringMax } from "../../validation/validators/floatString/FloatStringMax";
import { FloatStringMin } from "../../validation/validators/floatString/FloatStringMin";
import { IsFloatString } from "../../validation/validators/floatString/IsFloatString";

type PostParticipantPayload = PostParticipantAdminApiRequest["payload"];

export class ParticipantDto implements PostParticipantPayload {
  @IsInt()
  @IsNotEmpty()
  @Validate(RunnerIdExistsRule)
  runnerId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  bibNumber: number;

  @IsInt()
  @IsOptional()
  @Validate(CustomRunnerCategoryIdExistsRule)
  customCategoryId: number | null;

  @IsBoolean()
  @IsNotEmpty()
  stopped: boolean;

  @IsNotEmpty()
  @IsFloatString()
  @FloatStringMin(0)
  @FloatStringMax(RACE_MAX_DISTANCE)
  finalDistance: string;
}
