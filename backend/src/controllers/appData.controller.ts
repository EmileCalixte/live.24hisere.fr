import { MiscService } from "../services/database/entities/misc.service";
import { Controller, Get, Logger } from "@nestjs/common";
import { PassageService } from "../services/database/entities/passage.service";
import { RaceService } from "../services/database/entities/race.service";
import { RunnerService } from "../services/database/entities/runner.service";
import { type PublicPassageWithRunnerId } from "../types/Passage";
import { type AppDataResponse } from "../types/responses/AppData";
import { excludeKeys } from "../utils/misc.utils";

interface CachedPassages {
    cacheTime: Date;
    passages: AppDataResponse["passages"];
}

// The time (in ms) during which the controller can return a cached passage list, without retrieving it from the database
const PASSAGES_CACHE_DURATION = 5000;

@Controller()
export class AppDataController {
    private readonly logger;

    private cachedPassages: CachedPassages | undefined;

    constructor(
        private readonly miscService: MiscService,
        private readonly raceService: RaceService,
        private readonly runnerService: RunnerService,
        private readonly passageService: PassageService,
    ) {
        this.logger = new Logger("AppDataController");
    }

    @Get("/app-data")
    async getAppData(): Promise<AppDataResponse> {
        return {
            currentTime: new Date().toISOString(),
            lastUpdateTime: await this.miscService.getLastUpdateTime(true),
            races: (await this.raceService.getPublicRaces()).map(race => excludeKeys(race, ["runnerCount"])),
            runners: await this.runnerService.getPublicRunners(),
            passages: await this.getPassages(),
        };
    }

    private canSendCachedPassages(): boolean {
        if (!this.cachedPassages) {
            return false;
        }

        return new Date() <= new Date(this.cachedPassages.cacheTime.getTime() + PASSAGES_CACHE_DURATION);
    }

    private async getPassages(): Promise<PublicPassageWithRunnerId[]> {
        if (!this.canSendCachedPassages()) {
            this.cachedPassages = {
                cacheTime: new Date(),
                passages: await this.passageService.getAllPublicPassagesOfPublicRunners(),
            };
        } else {
            this.logger.verbose("Sending cached passage list");
        }

        return (this.cachedPassages as CachedPassages).passages;
    }
}
