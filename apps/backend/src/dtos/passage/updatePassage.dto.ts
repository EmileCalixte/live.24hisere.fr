import { OmitType, PartialType } from "@nestjs/mapped-types";
import { PatchPassageAdminApiRequest } from "@live24hisere/core/types";
import { PassageDto } from "./passage.dto";

type PatchPassagePayload = PatchPassageAdminApiRequest["payload"];

export class UpdatePassageDto
  extends PartialType(OmitType(PassageDto, ["raceId", "runnerId"] as const))
  implements PatchPassagePayload {}
