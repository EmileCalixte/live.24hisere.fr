import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiResponse, GetPassageImportRulesAdminApiRequest } from "@live24hisere/core/types";
import { AuthGuard } from "../../guards/auth.guard";
import { PassageImportRuleService } from "../../services/database/entities/passageImportRule.service";

@Controller()
@UseGuards(AuthGuard)
export class PassageImportRulesController {
  constructor(private readonly passageImportRuleService: PassageImportRuleService) {}

  @Get("/admin/passage-import-rules")
  async getRules(): Promise<ApiResponse<GetPassageImportRulesAdminApiRequest>> {
    const rules = await this.passageImportRuleService.getRules();

    return { rules };
  }
}
