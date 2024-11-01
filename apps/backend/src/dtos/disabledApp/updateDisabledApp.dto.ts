import { PartialType } from "@nestjs/mapped-types";
import { PatchDisabledAppDataAdminApiRequest } from "@live24hisere/core/types";
import { DisabledAppDto } from "./disabledApp.dto";

type PatchDisabledAppDataPayload = PatchDisabledAppDataAdminApiRequest["payload"];

export class UpdateDisabledAppDto extends PartialType(DisabledAppDto) implements PatchDisabledAppDataPayload {}
