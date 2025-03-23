import { BadRequestException, Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import {
  ApiResponse,
  GetPassageImportRuleAdminApiRequest,
  GetPassageImportRulesAdminApiRequest,
} from "@live24hisere/core/types";
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

  @Get("/admin/passage-import-rules/:ruleId")
  async getRuleById(@Param("ruleId") ruleId: string): Promise<ApiResponse<GetPassageImportRuleAdminApiRequest>> {
    const id = Number(ruleId);

    if (isNaN(id)) {
      throw new BadRequestException("Rule ID must be a number");
    }

    const rule = await this.passageImportRuleService.getRuleById(id);

    if (!rule) {
      throw new NotFoundException("Passage import rule not found");
    }

    return { rule };
  }
}
