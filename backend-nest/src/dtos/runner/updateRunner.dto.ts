import { PartialType } from "@nestjs/mapped-types";
import { RunnerDto } from "./runner.dto";

export class UpdateRunnerDto extends PartialType(RunnerDto) {}
