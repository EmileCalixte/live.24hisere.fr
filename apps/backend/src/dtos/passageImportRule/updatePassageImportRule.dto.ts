import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional } from "class-validator";
import { PatchPassageImportRuleAdminApiRequest } from "@live24hisere/core/types";
import { PassageImportRuleDto } from "./passageImportRule.dto";

type PatchPassageImportRulePayload = PatchPassageImportRuleAdminApiRequest["payload"];

export class UpdatePassageImportRuleDto
  extends PartialType(PassageImportRuleDto)
  implements PatchPassageImportRulePayload
{
  @IsNumber({}, { each: true })
  @IsOptional()
  raceIds?: number[];
}
