import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiResponse, GetRunnerParticipationsApiRequest, RunnerWithRaceCount } from "@live24hisere/core/types";
import { ParticipantService } from "../services/database/entities/participant.service";
import { RunnerService } from "../services/database/entities/runner.service";

@Controller()
export class ParticipantsController {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly runnerService: RunnerService,
  ) {}

  @Get("/runners/:runnerId/participations")
  async getRunnerParticipations(
    @Param("runnerId") runnerId: string,
  ): Promise<ApiResponse<GetRunnerParticipationsApiRequest>> {
    const runner = await this.getRunner(runnerId);

    return {
      participations: await this.participantService.getPublicParticipantByRunnerId(runner.id),
    };
  }

  private async getRunner(runnerId: number | string): Promise<RunnerWithRaceCount> {
    const id = Number(runnerId);

    if (isNaN(id)) {
      throw new BadRequestException("Runner ID must be a number");
    }

    const runner = await this.runnerService.getPublicRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    return runner;
  }
}
