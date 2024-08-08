import { ConfigService } from "../services/database/entities/config.service";
import { MiscService } from "../services/database/entities/misc.service";
import { Controller, Get } from "@nestjs/common";
import { AppDataResponse } from "../types/responses/AppData";

@Controller()
export class AppDataController {
    constructor(
        private readonly configService: ConfigService,
        private readonly miscService: MiscService,
    ) {}

    @Get("/app-data")
    async getAppData(): Promise<AppDataResponse> {
        const [
            isAppEnabled,
            disabledAppMessage,
            lastUpdateTime,
        ] = await Promise.all([
            this.configService.getIsAppEnabled(),
            this.configService.getDisabledAppMessage(),
            this.miscService.getLastUpdateTime(true),
        ]);

        return {
            currentTime: new Date().toISOString(),
            isAppEnabled: isAppEnabled ?? false,
            disabledAppMessage: isAppEnabled ? null : disabledAppMessage,
            lastUpdateTime,
        };
    }
}
