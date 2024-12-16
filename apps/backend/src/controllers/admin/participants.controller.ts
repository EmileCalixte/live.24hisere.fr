import { BadRequestException, Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import {
  AdminRaceWithRunnerCount,
  AdminRunner,
  ApiResponse,
  GetRaceParticipantAdminApiRequest,
  RunnerWithRaceCount,
} from "@live24hisere/core/types";
import { AuthGuard } from "../../guards/auth.guard";
import { ParticipantService } from "../../services/database/entities/participant.service";
import { RaceService } from "../../services/database/entities/race.service";
import { RunnerService } from "../../services/database/entities/runner.service";
import { GetRunnerParticipationsAdminApiRequest } from "./../../../../frontend/node_modules/@live24hisere/core/src/types/api/Participants";

@Controller()
@UseGuards(AuthGuard)
export class ParticipantsController {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly raceService: RaceService,
    private readonly runnerService: RunnerService,
  ) {}

  @Get("/admin/runners/:runnerId/participations")
  async getRunnerParticipations(
    @Param("runnerId") runnerId: string,
  ): Promise<ApiResponse<GetRunnerParticipationsAdminApiRequest>> {
    const runner = await this.getRunner(runnerId);

    return {
      participations: await this.participantService.getAdminParticipantsByRunnerId(runner.id),
    };
  }

  @Get("/admin/races/:raceId/runners/:runnerId")
  async getRaceRunner(
    @Param("raceId") raceId: string,
    @Param("runnerId") runnerId: string,
  ): Promise<ApiResponse<GetRaceParticipantAdminApiRequest>> {
    const runner = await this.getRunner(runnerId);
    const race = await this.getRace(raceId);

    const raceRunner = await this.runnerService.getAdminRaceRunner(race.id, runner.id);

    if (!raceRunner) {
      throw new NotFoundException("Runner not found");
    }

    return {
      runner: raceRunner,
    };
  }

  private async getRunner(runnerId: string): Promise<RunnerWithRaceCount<AdminRunner>> {
    const id = Number(runnerId);

    if (isNaN(id)) {
      throw new BadRequestException("Runner ID must be a number");
    }

    const runner = await this.runnerService.getAdminRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    return runner;
  }

  private async getRace(raceId: string): Promise<AdminRaceWithRunnerCount> {
    const id = Number(raceId);

    if (isNaN(id)) {
      throw new BadRequestException("Race ID must be a number");
    }

    const race = await this.raceService.getAdminRaceById(id);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    return race;
  }
}
