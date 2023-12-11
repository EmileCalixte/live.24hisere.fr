import { MiscService } from "../services/database/entities/misc.service";
import { Controller, Get, Logger } from "@nestjs/common";
import { type AppDataResponse } from "../types/responses/AppData";

@Controller()
export class AppDataController {
    private readonly logger;

    constructor(
        private readonly miscService: MiscService,
    ) {
        this.logger = new Logger("AppDataController");
    }

    @Get("/app-data")
    async getAppData(): Promise<AppDataResponse> {
        return {
            currentTime: new Date().toISOString(),
            lastUpdateTime: await this.miscService.getLastUpdateTime(true),
        };
    }
}
