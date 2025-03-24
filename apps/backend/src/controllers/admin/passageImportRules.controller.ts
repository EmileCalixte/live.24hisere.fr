import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  GetPassageImportRuleAdminApiRequest,
  GetPassageImportRulesAdminApiRequest,
  PatchPassageImportRuleAdminApiRequest,
  PostPassageImportRuleAdminApiRequest,
} from "@live24hisere/core/types";
import { PassageImportRuleDto } from "../../dtos/passageImportRule/passageImportRule.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { PassageImportRuleService } from "../../services/database/entities/passageImportRule.service";
import { RaceService } from "../../services/database/entities/race.service";
import { UpdatePassageImportRuleDto } from "./../../dtos/passageImportRule/updatePassageImportRule.dto";

@Controller()
@UseGuards(AuthGuard)
export class PassageImportRulesController {
  constructor(
    private readonly passageImportRuleService: PassageImportRuleService,
    private readonly raceService: RaceService,
  ) {}

  @Get("/admin/passage-import-rules")
  async getRules(): Promise<ApiResponse<GetPassageImportRulesAdminApiRequest>> {
    const rules = await this.passageImportRuleService.getRules();

    return { rules };
  }

  @Get("/admin/passage-import-rules/:ruleId")
  async getRule(@Param("ruleId") ruleId: string): Promise<ApiResponse<GetPassageImportRuleAdminApiRequest>> {
    const id = Number(ruleId);

    if (isNaN(id)) {
      throw new BadRequestException("Rule ID must be a number");
    }

    const rule = await this.passageImportRuleService.getRuleWithRaceIdsById(id);

    if (!rule) {
      throw new NotFoundException("Passage import rule not found");
    }

    return { rule };
  }

  @Post("/admin/passage-import-rules")
  async createRule(@Body() ruleDto: PassageImportRuleDto): Promise<ApiResponse<PostPassageImportRuleAdminApiRequest>> {
    const rule = await this.passageImportRuleService.createRule(ruleDto);

    return { rule };
  }

  @Patch("/admin/passage-import-rules/:ruleId")
  async updateRule(
    @Param("ruleId") ruleId: string,
    @Body() updateRuleDto: UpdatePassageImportRuleDto,
  ): Promise<ApiResponse<PatchPassageImportRuleAdminApiRequest>> {
    const id = Number(ruleId);

    if (isNaN(id)) {
      throw new BadRequestException("Rule ID must be a number");
    }

    const rule = await this.passageImportRuleService.getRuleById(id);

    if (!rule) {
      throw new NotFoundException("Passage import rule not found");
    }

    if (updateRuleDto.raceIds) {
      await this.ensureRaceIdsExist(updateRuleDto.raceIds);
    }

    return {
      rule: await this.passageImportRuleService.updateRule(rule.id, updateRuleDto),
    };
  }

  private async ensureRaceIdsExist(raceIds: number[]): Promise<void> {
    const allRacesExist = await this.raceService.doAllRacesExist(raceIds);

    if (!allRacesExist) {
      throw new BadRequestException("All race IDs must be IDs of existing races");
    }
  }
}
