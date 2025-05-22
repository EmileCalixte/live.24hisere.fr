import { PartialType } from "@nestjs/mapped-types";
import { PatchCustomRunnerCategoryAdminApiRequest } from "@live24hisere/core/types";
import { CustomRunnerCategoryDto } from "./customRunnerCategory.dto";

type PatchCustomRunnerCategoryPayload = PatchCustomRunnerCategoryAdminApiRequest["payload"];

export class UpdateCustomRunnerCategoryDto
  extends PartialType(CustomRunnerCategoryDto)
  implements PatchCustomRunnerCategoryPayload {}
