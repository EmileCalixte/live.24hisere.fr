import { helloWorldUtils, Toto } from "@live24hisere/utils/test-utils";
import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "../services/database/entities/config.service";
import { MiscService } from "../services/database/entities/misc.service";
import { AppDataResponse } from "../types/responses/AppData";

@Controller()
export class AppDataController {
    constructor(
        private readonly configService: ConfigService,
        private readonly miscService: MiscService,
    ) {}

    @Get("/app-data")
    async getAppData(): Promise<AppDataResponse> {
        const [lastUpdateTime] =
            await Promise.all([
                // this.configService.getIsAppEnabled(),
                // this.configService.getDisabledAppMessage(),
                this.miscService.getLastUpdateTime(true),
            ]);

        const text: Toto = "tata";

        return {
            currentTime: new Date().toISOString(),
            // isAppEnabled: isAppEnabled ?? false,
            isAppEnabled: false,
            // disabledAppMessage: isAppEnabled ? null : disabledAppMessage,
            disabledAppMessage: helloWorldUtils.helloWorld(text),
            lastUpdateTime,
        };
    }
}
