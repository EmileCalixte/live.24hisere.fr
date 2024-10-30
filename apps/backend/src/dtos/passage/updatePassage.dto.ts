import { PartialType } from "@nestjs/mapped-types";
import { PatchRunnerPassageAdminApiRequest } from "@live24hisere/core/types";
import { PassageDto } from "./passage.dto";

type PatchPassagePayload = PatchRunnerPassageAdminApiRequest["payload"];

export class UpdatePassageDto
    extends PartialType(PassageDto)
    implements PatchPassagePayload {}
