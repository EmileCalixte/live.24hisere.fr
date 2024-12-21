import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  AdminRaceWithRunnerCount,
  AdminRunner,
  ApiResponse,
  GetRaceParticipantAdminApiRequest,
  Participant,
  PatchParticipantAdminApiRequest,
  PostParticipantAdminApiRequest,
  RunnerWithRaceCount,
} from "@live24hisere/core/types";
import { ParticipantDto } from "../../dtos/participant/participant.dto";
import { UpdateParticipantDto } from "../../dtos/participant/updateParticipant.dto";
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

  @Post("/admin/races/:raceId/runners")
  async addRunnerToRace(
    @Param("raceId") raceId: string,
    @Body() participantDto: ParticipantDto,
  ): Promise<ApiResponse<PostParticipantAdminApiRequest>> {
    const race = await this.getRace(raceId);
    const runner = await this.getRunner(participantDto.runnerId);

    await this.ensureBibNumberIsAvailable(participantDto.bibNumber, race.id);

    const participant = await this.participantService.createParticipant({
      ...participantDto,
      raceId: race.id,
      runnerId: runner.id,
    });

    return { participant };
  }

  @Patch("/admin/races/:raceId/runners/:runnerId")
  async updateRaceRunner(
    @Param("raceId") raceId: string,
    @Param("runnerId") runnerId: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Promise<ApiResponse<PatchParticipantAdminApiRequest>> {
    const race = await this.getRace(raceId);
    const runner = await this.getRunner(runnerId);
    const participant = await this.getParticipant(race.id, runner.id);

    if (updateParticipantDto.bibNumber !== undefined && updateParticipantDto.bibNumber !== participant.bibNumber) {
      await this.ensureBibNumberIsAvailable(updateParticipantDto.bibNumber, race.id);
    }

    const updatedParticipant = await this.participantService.updateParticipant(participant.id, updateParticipantDto);

    return { participant: updatedParticipant };
  }

  private async getRunner(runnerId: number | string): Promise<RunnerWithRaceCount<AdminRunner>> {
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

  private async getParticipant(raceId: number, runnerId: number): Promise<Participant> {
    const participant = await this.participantService.getAdminParticipantByRaceIdAndRunnerId(raceId, runnerId);

    if (!participant) {
      throw new NotFoundException(`Runner with ID ${runnerId} does not take part in race with ID ${raceId}`);
    }

    return participant;
  }

  private async ensureBibNumberIsAvailable(bibNumber: number, raceId: number): Promise<void> {
    const existingParticipant = await this.participantService.getAdminParticipantByRaceIdAndBibNumber(
      bibNumber,
      raceId,
    );

    if (existingParticipant) {
      throw new BadRequestException(
        `Bib number ${bibNumber} is already assigned to a runner in race with ID ${raceId}`,
      );
    }
  }
}
