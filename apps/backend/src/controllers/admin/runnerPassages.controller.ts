import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  PatchRunnerPassageAdminApiRequest,
  PostRunnerPassageAdminApiRequest,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { PassageDto } from "../../dtos/passage/passage.dto";
import { UpdatePassageDto } from "../../dtos/passage/updatePassage.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { PassageService } from "../../services/database/entities/passage.service";
import { RaceService } from "../../services/database/entities/race.service";
import { RunnerService } from "../../services/database/entities/runner.service";

@Controller()
@UseGuards(AuthGuard)
export class RunnerPassagesController {
  constructor(
    private readonly passageService: PassageService,
    private readonly raceService: RaceService,
    private readonly runnerService: RunnerService,
  ) {}

  @Post("/admin/races/:raceId/runners/:runnerId/passages")
  async getRunnerPassages(
    @Param("raceId") raId: string,
    @Param("runnerId") ruId: string,
    @Body() passageDto: PassageDto,
  ): Promise<ApiResponse<PostRunnerPassageAdminApiRequest>> {
    const raceId = Number(raId);

    if (isNaN(raceId)) {
      throw new BadRequestException("RaceId must be a number");
    }

    const runnerId = Number(ruId);

    if (isNaN(runnerId)) {
      throw new BadRequestException("RunnerId must be a number");
    }

    const race = await this.raceService.getAdminRaceById(raceId);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    const runner = await this.runnerService.getAdminRunnerById(runnerId);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    const passage = await this.passageService.createPassage(raceId, runnerId, {
      ...passageDto,
      detectionId: null,
      importTime: null,
    });

    return {
      passage: objectUtils.excludeKeys(passage, ["raceId", "runnerId"]),
    };
  }

  @Patch("/admin/races/:raceId/runners/:runnerId/passages/:passageId")
  async updateRunnerPassage(
    @Param("raceId") raId: string,
    @Param("runnerId") ruId: string,
    @Param("passageId") pId: string,
    @Body() updatePassageDto: UpdatePassageDto,
  ): Promise<ApiResponse<PatchRunnerPassageAdminApiRequest>> {
    const raceId = Number(raId);
    const runnerId = Number(ruId);
    const passageId = Number(pId);

    if (isNaN(raceId)) {
      throw new BadRequestException("RaceId must be a number");
    }

    if (isNaN(runnerId)) {
      throw new BadRequestException("RunnerId must be a number");
    }

    if (isNaN(passageId)) {
      throw new BadRequestException("PassageId must be a number");
    }

    const passage = await this.passageService.getPassageById(passageId);

    if (!passage || passage.raceId !== raceId || passage.runnerId !== runnerId) {
      throw new NotFoundException("Passage not found");
    }

    const updatedPassage = await this.passageService.updatePassage(passageId, updatePassageDto);

    return {
      passage: objectUtils.excludeKeys(updatedPassage, ["raceId", "runnerId"]),
    };
  }

  @Delete("/admin/runners/:runnerId/passages/:passageId")
  @HttpCode(204)
  async deleteRunnerPassage(@Param("runnerId") runnerId: string, @Param("passageId") passageId: string): Promise<void> {
    const rId = Number(runnerId);
    const pId = Number(passageId);

    if (isNaN(rId)) {
      throw new BadRequestException("RunnerId must be a number");
    }

    if (isNaN(pId)) {
      throw new BadRequestException("PassageId must be a number");
    }

    const passage = await this.passageService.getPassageById(pId);

    if (!passage || passage.runnerId !== rId) {
      throw new NotFoundException("Passage not found");
    }

    await this.passageService.deletePassage(pId);
  }
}
