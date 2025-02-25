import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import {
  ApiResponse,
  GetEditionRacesApiRequest,
  GetRaceApiRequest,
  GetRacesApiRequest,
} from "@live24hisere/core/types";
import { EditionService } from "../services/database/entities/edition.service";
import { RaceService } from "../services/database/entities/race.service";

@Controller()
export class RacesController {
  constructor(
    private readonly editionService: EditionService,
    private readonly raceService: RaceService,
  ) {}

  @Get("/races")
  async getRaces(): Promise<ApiResponse<GetRacesApiRequest>> {
    const races = await this.raceService.getPublicRaces();

    return {
      races,
    };
  }

  @Get("/editions/:editionId/races")
  async getEditionRaces(@Param("editionId") editionId: string): Promise<ApiResponse<GetEditionRacesApiRequest>> {
    const id = Number(editionId);

    if (isNaN(id)) {
      throw new BadRequestException("Edition ID must be a number");
    }

    const edition = await this.editionService.getPublicEditionById(id);

    if (!edition) {
      throw new NotFoundException("Edition not found");
    }

    const races = await this.raceService.getPublicEditionRaces(edition.id);

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
