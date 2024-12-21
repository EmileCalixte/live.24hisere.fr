import { IsBoolean, IsInt, IsNotEmpty, Min, Validate } from "class-validator";
import { PostParticipantAdminApiRequest } from "@live24hisere/core/types";
import { RunnerIdExistsRule } from "../../validation/rules/runner/runnerIdExists.rule";

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

  @IsBoolean()
  @IsNotEmpty()
  stopped: boolean;
}
