import { Controller, Get } from "@nestjs/common";
import { ApiResponse, GetAppDataApiRequest } from "@live24hisere/core/types";
import { ConfigService } from "../services/database/entities/config.service";
import { CustomRunnerCategoryService } from "../services/database/entities/customRunnerCategory.service";
import { MiscService } from "../services/database/entities/misc.service";

@Controller()
export class AppDataController {
  constructor(
    private readonly configService: ConfigService,
    private readonly customRunnerCategoryService: CustomRunnerCategoryService,
    private readonly miscService: MiscService,
  ) {}

  @Get("/app-data")
  async getAppData(): Promise<ApiResponse<GetAppDataApiRequest>> {
    const [
      isAppEnabled,
      disabledAppMessage,
      currentEditionId,
      customRunnerCategories,
      lastUpdateTime,
      isGlobalInformationMessageVisible,
      globalInformationMessage,
    ] = await Promise.all([
      this.configService.getIsAppEnabled(),
      this.configService.getDisabledAppMessage(),
      this.configService.getCurrentEditionId(),
      this.customRunnerCategoryService.getCategories(),
      this.miscService.getLastUpdateTime(true),
      this.configService.getIsGlobalInformationMessageVisible(),
      this.configService.getGlobalInformationMessage(),
    ]);

    return {
      currentTime: new Date().toISOString(),
      isAppEnabled: isAppEnabled ?? false,
      disabledAppMessage: isAppEnabled ? null : disabledAppMessage,
      globalInformationMessage: isGlobalInformationMessageVisible ? globalInformationMessage : null,
      currentEditionId,
      customRunnerCategories,
      lastUpdateTime,
    };
  }
}
