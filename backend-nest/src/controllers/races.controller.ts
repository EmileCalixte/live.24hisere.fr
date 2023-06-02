import {Controller, Get} from "@nestjs/common";
import {RaceService} from "src/services/database/entities/race.service";
import {PublicRace} from "src/types/Race";

interface RacesResponse {
    races: PublicRace[];
}

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
}
