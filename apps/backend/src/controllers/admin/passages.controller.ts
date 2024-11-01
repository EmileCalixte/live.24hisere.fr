import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiResponse, GetAllPassagesAdminApiRequest } from "@live24hisere/core/types";
import { typeUtils } from "@live24hisere/utils";
import { AuthGuard } from "../../guards/auth.guard";
import { PassageService } from "../../services/database/entities/passage.service";
import { QueryParam } from "../../types/utils/query";

@Controller()
@UseGuards(AuthGuard)
export class PassagesController {
  constructor(private readonly passageService: PassageService) {}

  @Get("/admin/passages")
  async getPassages(
    @Query("excludeHidden") excludeHidden: QueryParam,
  ): Promise<ApiResponse<GetAllPassagesAdminApiRequest>> {
    const passages = typeUtils.isDefined(excludeHidden)
      ? await this.passageService.getAllPublicPassages()
      : await this.passageService.getAllPassages();

    return { passages };
  }
}
