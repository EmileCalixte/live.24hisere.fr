import { PartialType } from "@nestjs/mapped-types";
import { PatchRaceAdminApiRequest } from "@live24hisere/core/types";
import { RaceDto } from "./race.dto";

type PatchRacePayload = PatchRaceAdminApiRequest["payload"];

export class UpdateRaceDto
    extends PartialType(RaceDto)
    implements PatchRacePayload {}
