import { PartialType } from "@nestjs/mapped-types";
import { PatchRunnerAdminApiRequest } from "@live24hisere/core/types";
import { RunnerDto } from "./runner.dto";

type PatchRunnerPayload = PatchRunnerAdminApiRequest["payload"];

export class UpdateRunnerDto extends PartialType(RunnerDto) implements PatchRunnerPayload {}
