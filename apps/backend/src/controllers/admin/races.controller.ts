import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  RawBodyRequest,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  GetRaceAdminApiRequest,
  GetRacesAdminApiRequest,
  PatchRaceAdminApiRequest,
  PostRaceAdminApiRequest,
} from "@live24hisere/core/types";
import { RaceDto } from "../../dtos/race/race.dto";
import { UpdateRaceDto } from "../../dtos/race/updateRace.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { RaceService } from "../../services/database/entities/race.service";

@Controller()
@UseGuards(AuthGuard)
export class RacesController {
  constructor(private readonly raceService: RaceService) {}

  @Get("/admin/races")
  async getRaces(): Promise<ApiResponse<GetRacesAdminApiRequest>> {
    const races = await this.raceService.getAdminRaces();

    return {
      races,
    };
  }

  @Post("/admin/races")
  async createRace(@Body() raceDto: RaceDto): Promise<ApiResponse<PostRaceAdminApiRequest>> {
    await this.ensureRaceNameDoesNotExist(raceDto.name);

    const race = await this.raceService.createRace({
      ...raceDto,
      order: (await this.raceService.getMaxOrder()) + 1,
    });

    return { race };
  }

  @Get("/admin/races/:raceId")
  async getRace(@Param("raceId") raceId: string): Promise<ApiResponse<GetRaceAdminApiRequest>> {
    const id = Number(raceId);

    if (isNaN(id)) {
      throw new BadRequestException("Race ID must be a number");
    }

    const race = await this.raceService.getAdminRaceById(id);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    return {
      race,
    };
  }

  @Patch("/admin/races/:raceId")
  async updateRace(
    @Param("raceId") raceId: string,
    @Body() updateRaceDto: UpdateRaceDto,
  ): Promise<ApiResponse<PatchRaceAdminApiRequest>> {
    const id = Number(raceId);

    if (isNaN(id)) {
      throw new BadRequestException("Race ID must be a number");
    }

    const race = await this.raceService.getAdminRaceById(id);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    if (updateRaceDto.name && race.name !== updateRaceDto.name) {
      await this.ensureRaceNameDoesNotExist(updateRaceDto.name);
    }

    const updatedRace = await this.raceService.updateRace(id, updateRaceDto);

    return {
      race: updatedRace,
    };
  }

  @Delete("/admin/races/:raceId")
  @HttpCode(204)
  async deleteRace(@Param("raceId") raceId: string): Promise<void> {
    const id = Number(raceId);

    if (isNaN(id)) {
      throw new BadRequestException("Race ID must be a number");
    }

    const race = await this.raceService.getAdminRaceById(id);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    if (race.runnerCount > 0) {
      throw new BadRequestException("Cannot delete a race if there are runners in it");
    }

    await this.raceService.deleteRace(id);
  }

  @Put("/admin/races-order")
  @HttpCode(204)
  async updateRacesOrder(@Req() req: RawBodyRequest<Request>): Promise<void> {
    const body = req.body;

    if (!Array.isArray(body)) {
      throw new BadRequestException("Request body must be an array of race ids");
    }

    let order = 0;

    const allRaces = await this.raceService.getAdminRaces();
    const touchedRaceIds = new Set<(typeof allRaces)[number]["id"]>();
    const updates: Array<Promise<unknown>> = [];

    // Update races whose id has been passed in body
    for (const raceId of body) {
      if (typeof raceId !== "number") {
        continue;
      }

      const race = allRaces.find((r) => r.id === raceId);

      if (!race) {
        continue;
      }

      updates.push(this.raceService.updateRace(raceId, { order }));
      ++order;

      touchedRaceIds.add(raceId);
    }

    // Update other races order to last provided race order + 1
    for (const race of allRaces) {
      if (touchedRaceIds.has(race.id)) {
        continue;
      }

      updates.push(this.raceService.updateRace(race.id, { order }));
    }

    await Promise.all(updates);
  }

  private async ensureRaceNameDoesNotExist(name: string): Promise<void> {
    const existingRace = await this.raceService.getAdminRaceByName(name);

    if (existingRace) {
      throw new BadRequestException("A race with the same name already exists");
    }
  }
}
