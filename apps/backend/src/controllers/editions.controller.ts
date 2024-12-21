import { Controller, Get } from "@nestjs/common";
import { ApiResponse, GetEditionsApiRequest } from "@live24hisere/core/types";
import { EditionService } from "./../services/database/entities/edition.service";

@Controller()
export class EditionsController {
  constructor(private readonly editionService: EditionService) {}

  @Get("/editions")
  async getEditions(): Promise<ApiResponse<GetEditionsApiRequest>> {
    const editions = await this.editionService.getPublicEditions();

    return {
      editions,
    };
  }
}
