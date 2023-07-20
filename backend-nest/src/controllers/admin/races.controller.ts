import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards
} from "@nestjs/common";
import { RaceDto } from "../../dtos/race/race.dto";
import { UpdateRaceDto } from "../../dtos/race/updateRace.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { RaceService } from "../../services/database/entities/race.service";
import { type AdminRaceResponse, type AdminRacesResponse } from "../../types/responses/admin/Races";

@Controller()
@UseGuards(AuthGuard)
export class RacesController {
    constructor(
        private readonly raceService: RaceService,
    ) {}

    @Get("/admin/races")
    async getRaces(): Promise<AdminRacesResponse> {
        const races = await this.raceService.getAdminRaces();

        return {
            races,
        };
    }

    @Post("/admin/races")
    async createRace(@Body() raceDto: RaceDto): Promise<AdminRaceResponse> {
        const race = await this.raceService.createRace({
            ...raceDto,
            order: await this.raceService.getMaxOrder() + 1,
        });

        return {
            race: {
                ...race,
                runnerCount: 0,
            },
        };
    }

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

    @Patch("/admin/races/:raceId")
    async updateRace(@Param("raceId") raceId: string, @Body() updateRaceDto: UpdateRaceDto): Promise<AdminRaceResponse> {
        const id = Number(raceId);

        if (isNaN(id)) {
            throw new BadRequestException("Race ID must be a number");
        }

        const race = await this.raceService.getAdminRace({ id });

        if (!race) {
            throw new NotFoundException("Race not found");
        }

        const updatedRace = await this.raceService.updateRace(id, updateRaceDto);

        return {
            race: updatedRace,
        };
    }
}
