import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { typeUtils } from "@live24hisere/utils";
import { helloWorldUtils } from "@live24hisere/utils/test-utils";
import { UpdateDisabledAppDto } from "../../dtos/disabledApp/updateDisabledApp.dto";
import { UpdatePassageImportSettingsDto } from "../../dtos/passageImport/updatePassageImportSettings.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { ConfigService } from "../../services/database/entities/config.service";
import {
    AdminDisabledAppResponse,
    AdminPassageImportSettingsResponse,
} from "../../types/responses/admin/Config";

@Controller()
@UseGuards(AuthGuard)
export class ConfigController {
    constructor(private readonly configService: ConfigService) {}

    @Get("/admin/disabled-app")
    async getDisabledApp(): Promise<AdminDisabledAppResponse> {
        return await this.getDisabledAppData();
    }

    @Patch("/admin/disabled-app")
    async updateDisabledApp(
        @Body() updateDisabledAppDto: UpdateDisabledAppDto,
    ): Promise<AdminDisabledAppResponse> {
        const promises = [];
        console.log(helloWorldUtils.helloWorld());

        if (!typeUtils.isNullOrUndefined(updateDisabledAppDto.isAppEnabled)) {
            promises.push(
                this.configService.setIsAppEnabled(
                    updateDisabledAppDto.isAppEnabled,
                ),
            );
        }

        if (
            !typeUtils.isNullOrUndefined(
                updateDisabledAppDto.disabledAppMessage,
            )
        ) {
            promises.push(
                this.configService.setDisabledAppMessage(
                    updateDisabledAppDto.disabledAppMessage,
                ),
            );
        }

        await Promise.all(promises);

        return await this.getDisabledAppData();
    }

    @Get("/admin/passage-import")
    async getPassageImportSettings(): Promise<AdminPassageImportSettingsResponse> {
        return await this.getPassageImportSettingsData();
    }

    @Patch("/admin/passage-import")
    async updatePassageImportSettings(
        @Body() updatePassageImportSettingsDto: UpdatePassageImportSettingsDto,
    ): Promise<AdminPassageImportSettingsResponse> {
        if (typeUtils.isDefined(updatePassageImportSettingsDto.dagFileUrl)) {
            await this.configService.setImportDagFilePath(
                updatePassageImportSettingsDto.dagFileUrl,
            );
        }

        return await this.getPassageImportSettingsData();
    }

    private async getDisabledAppData(): Promise<AdminDisabledAppResponse> {
        const [isAppEnabled, disabledAppMessage] = await Promise.all([
            this.configService.getIsAppEnabled(),
            this.configService.getDisabledAppMessage(),
        ]);

        return {
            isAppEnabled: isAppEnabled ?? false,
            disabledAppMessage,
        };
    }

    private async getPassageImportSettingsData(): Promise<AdminPassageImportSettingsResponse> {
        const dagFileUrl = await this.configService.getImportDagFilePath();

        return {
            dagFileUrl,
        };
    }
}
