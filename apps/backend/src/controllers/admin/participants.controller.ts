import { BadRequestException, Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiResponse } from "@live24hisere/core/types";
import { AuthGuard } from "../../guards/auth.guard";
import { ParticipantService } from "../../services/database/entities/participant.service";
import { RunnerService } from "../../services/database/entities/runner.service";
import { GetRunnerParticipationsAdminApiRequest } from "./../../../../frontend/node_modules/@live24hisere/core/src/types/api/Participants";

@Controller()
@UseGuards(AuthGuard)
export class ParticipantsController {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly runnerService: RunnerService,
  ) {}

  @Get("/admin/runners/:runnerId/participations")
  async getRunnerParticipations(
    @Param("runnerId") runnerId: string,
  ): Promise<ApiResponse<GetRunnerParticipationsAdminApiRequest>> {
    const id = Number(runnerId);

    if (isNaN(id)) {
      throw new BadRequestException("Runner ID must be a number");
    }

    const runner = await this.runnerService.getAdminRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    return {
      participations: await this.participantService.getAdminParticipantsByRunnerId(runner.id),
    };
  }
}
