import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { type RaceService } from "src/services/database/entities/race.service";
import { type RaceResponse, type RacesResponse } from "src/types/responses/Races";

@Controller()
export class RacesController {
    constructor(
        private readonly raceService: RaceService,
    ) {}

    @Get("/races")
    async getRaces(): Promise<RacesResponse> {
        const races = await this.raceService.getPublicRaces();

        return {
            races,
        };
    }

    @Get("/races/:raceId")
    async getRace(@Param("raceId") raceId: string): Promise<RaceResponse> {
        const id = Number(raceId);

        if (isNaN(id)) {
            throw new BadRequestException("Race ID must be a number");
        }

        const race = await this.raceService.getPublicRace({ id });

        if (!race) {
            throw new NotFoundException("Race not found");
        }

        return {
            race,
        };
    }
}
