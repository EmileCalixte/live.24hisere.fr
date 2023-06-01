import {Controller, Get} from "@nestjs/common";
import {RacesService} from "src/services/database/entities/races.service";
import {PublicRace} from "src/types/Race";

interface RacesResponse {
    races: PublicRace[];
}

@Controller()
export class RacesController {
    constructor(
        private readonly racesService: RacesService,
    ) {}

    @Get("/races")
    async getRaces(): Promise<RacesResponse> {
        const races = await this.racesService.getPublicRaces();

        return {
            races: races,
        };
    }
}
