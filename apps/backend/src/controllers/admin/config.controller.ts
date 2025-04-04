import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import {
  ApiResponse,
  DisabledAppData,
  GetDisabledAppDataAdminApiRequest,
  PatchDisabledAppDataAdminApiRequest,
} from "@live24hisere/core/types";
import { typeUtils } from "@live24hisere/utils";
import { UpdateDisabledAppDto } from "../../dtos/disabledApp/updateDisabledApp.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { ConfigService } from "../../services/database/entities/config.service";

@Controller()
@UseGuards(AuthGuard)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get("/admin/disabled-app")
  async getDisabledApp(): Promise<ApiResponse<GetDisabledAppDataAdminApiRequest>> {
    return await this.getDisabledAppData();
  }

  @Patch("/admin/disabled-app")
  async updateDisabledApp(
    @Body() updateDisabledAppDto: UpdateDisabledAppDto,
  ): Promise<ApiResponse<PatchDisabledAppDataAdminApiRequest>> {
    const promises = [];

    if (!typeUtils.isNullOrUndefined(updateDisabledAppDto.isAppEnabled)) {
      promises.push(this.configService.setIsAppEnabled(updateDisabledAppDto.isAppEnabled));
    }

    if (!typeUtils.isNullOrUndefined(updateDisabledAppDto.disabledAppMessage)) {
      promises.push(this.configService.setDisabledAppMessage(updateDisabledAppDto.disabledAppMessage));
    }

    await Promise.all(promises);

    return await this.getDisabledAppData();
  }

  private async getDisabledAppData(): Promise<DisabledAppData> {
    const [isAppEnabled, disabledAppMessage] = await Promise.all([
      this.configService.getIsAppEnabled(),
      this.configService.getDisabledAppMessage(),
    ]);

    return {
      isAppEnabled: isAppEnabled ?? false,
      disabledAppMessage,
    };
  }
}
