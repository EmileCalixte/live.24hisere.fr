import { PartialType } from "@nestjs/mapped-types";
import { PatchPassageImportSettingsAdminApiRequest } from "@live24hisere/core/types";
import { PassageImportSettingsDto } from "./passageImportSettings.dto";

type PatchPassageImportSettingsPayload = PatchPassageImportSettingsAdminApiRequest["payload"];

export class UpdatePassageImportSettingsDto
  extends PartialType(PassageImportSettingsDto)
  implements PatchPassageImportSettingsPayload {}
