import { MiscService } from "../services/database/entities/misc.service";
import { Controller, Get } from "@nestjs/common";
import { PassageService } from "../services/database/entities/passage.service";
import { RaceService } from "../services/database/entities/race.service";
import { RunnerService } from "../services/database/entities/runner.service";
import { type AppDataResponse } from "../types/responses/AppData";

@Controller()
export class AppDataController {
    constructor(
        private readonly miscService: MiscService,
        private readonly raceService: RaceService,
        private readonly runnerService: RunnerService,
        private readonly passageService: PassageService,
    ) {}

    @Get("/app-data")
    async getAppData(): Promise<AppDataResponse> {
        return {
            currentTime: new Date().toISOString(),
            lastUpdateTime: await this.miscService.getLastUpdateTime(true),
            races: await this.raceService.getPublicRaces(),
            runners: await this.runnerService.getPublicRunners(),
            passages: await this.passageService.getAllPublicPassagesOfPublicRunners(),
        };
    }
}
