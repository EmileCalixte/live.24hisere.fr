import { BadRequestException, Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { RaceService } from "../../services/database/entities/race.service";
import { type AdminRaceResponse, type AdminRacesResponse } from "../../types/responses/admin/Races";

@Controller()
export class RacesController {
    constructor(
        private readonly raceService: RaceService,
    ) {}

    @UseGuards(AuthGuard)
    @Get("/admin/races")
    async getRaces(): Promise<AdminRacesResponse> {
        const races = await this.raceService.getAdminRaces();

        return {
            races,
        };
    }

    @UseGuards(AuthGuard)
    @Get("/admin/races/:raceId")
    async getRace(@Param("raceId") raceId: string): Promise<AdminRaceResponse> {
        const id = Number(raceId);

        if (isNaN(id)) {
            throw new BadRequestException("Race ID must be a number");
        }

        const race = await this.raceService.getAdminRace({ id });

        if (!race) {
            throw new NotFoundException("Race not found");
        }

        return {
            race,
        };
    }
}
