import { IsBoolean, IsNotEmpty, IsUrl, MaxLength } from "class-validator";
import { PASSAGE_IMPORT_RULE_URL_MAX_LENGTH } from "@live24hisere/core/constants";
import { PostPassageImportRuleAdminApiRequest } from "@live24hisere/core/types";

type PostPassageImportRulePayload = PostPassageImportRuleAdminApiRequest["payload"];

export class PassageImportRuleDto implements PostPassageImportRulePayload {
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @MaxLength(PASSAGE_IMPORT_RULE_URL_MAX_LENGTH)
  url: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
