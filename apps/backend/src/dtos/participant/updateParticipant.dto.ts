import { OmitType, PartialType } from "@nestjs/mapped-types";
import { PatchParticipantAdminApiRequest } from "@live24hisere/core/types";
import { ParticipantDto } from "./participant.dto";

type PatchParticipantPayload = PatchParticipantAdminApiRequest["payload"];

export class UpdateParticipantDto
  extends PartialType(OmitType(ParticipantDto, ["runnerId"] as const))
  implements PatchParticipantPayload {}
