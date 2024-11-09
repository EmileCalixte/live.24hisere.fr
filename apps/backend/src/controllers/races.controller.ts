import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { ApiResponse, GetRaceApiRequest, GetRacesApiRequest } from "@live24hisere/core/types";
import { RaceService } from "../services/database/entities/race.service";
import { QueryParam } from "../types/utils/query";

@Controller()
export class RacesController {
  constructor(private readonly raceService: RaceService) {}

  @Get("/races")
  async getRaces(@Query("edition") edition: QueryParam): Promise<ApiResponse<GetRacesApiRequest>> {
    const editionId = parseInt(edition ?? "");

    if (isNaN(editionId)) {
      throw new BadRequestException("edition param must be provided in query string and must be numeric");
    }

    const races = await this.raceService.getPublicRaces(editionId);

    return {
      races,
    };
  }

  @Get("/races/:raceId")
  async getRace(@Param("raceId") raceId: string): Promise<ApiResponse<GetRaceApiRequest>> {
    const id = Number(raceId);

    if (isNaN(id)) {
      throw new BadRequestException("Race ID must be a number");
    }

    const race = await this.raceService.getPublicRaceById(id);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    return {
      race,
    };
  }
}
