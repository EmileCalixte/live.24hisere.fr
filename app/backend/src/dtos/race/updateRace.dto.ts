import { PartialType } from "@nestjs/mapped-types";
import { RaceDto } from "./race.dto";

export class UpdateRaceDto extends PartialType(RaceDto) {}
