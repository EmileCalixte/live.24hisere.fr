import {Controller, Get} from "@nestjs/common";
import {RacesService} from "src/services/database/entities/races.service";
import {PublicRace} from "src/types/Race";
import {excludeKeys} from "src/utils/misc.utils";

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
