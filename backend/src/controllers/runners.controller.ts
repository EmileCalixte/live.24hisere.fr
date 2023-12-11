import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { RaceService } from "../services/database/entities/race.service";
import { RunnerService } from "../services/database/entities/runner.service";
import { type RaceRunnersResponse, type RunnersResponse } from "../types/responses/Runners";

@Controller()
export class RunnersController {
    constructor(
        private readonly raceService: RaceService,
        private readonly runnerService: RunnerService,
    ) {}

    @Get("/runners")
    async getRunners(): Promise<RunnersResponse> {
        const runners = await this.runnerService.getPublicRunners();

        return {
            runners,
        };
    }

    @Get("/races/:raceId/runners")
    async getRaceRunners(@Param("raceId") raceId: string): Promise<RaceRunnersResponse> {
        const id = Number(raceId);

        if (isNaN(id)) {
            throw new BadRequestException("Race ID must be a number");
        }

        const race = await this.raceService.getPublicRace({ id });

        if (!race) {
            throw new NotFoundException("Race not found");
        }

        const runners = await this.runnerService.getPublicRunnersOfRace(id);

        return {
            runners,
        };
    }
}
