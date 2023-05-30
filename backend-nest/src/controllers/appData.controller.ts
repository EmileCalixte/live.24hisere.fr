import {MiscService} from "./../services/database/entities/misc.service";
import {Controller, Get} from "@nestjs/common";

interface AppDataResponse {
    currentTime: string;
    lastUpdateTime: string | null;
}

@Controller()
export class AppDataController {
    constructor(
        private readonly miscService: MiscService,
    ) {}

    @Get("/app-data")
    async getAppData(): Promise<AppDataResponse> {
        return {
            currentTime: new Date().toISOString(),
            lastUpdateTime: await this.miscService.getLastUpdateTime(true),
        };
    }
}
