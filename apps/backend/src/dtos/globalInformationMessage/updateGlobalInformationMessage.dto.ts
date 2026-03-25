import { PartialType } from "@nestjs/mapped-types";
import { PatchGlobalInformationMessageDataAdminApiRequest } from "@live24hisere/core/types";
import { GlobalInformationMessageDto } from "./globalInformationMessage.dto";

type PatchGlobalInformationMessageDataPayload = PatchGlobalInformationMessageDataAdminApiRequest["payload"];

export class UpdateGlobalInformationMessageDto
  extends PartialType(GlobalInformationMessageDto)
  implements PatchGlobalInformationMessageDataPayload {}
