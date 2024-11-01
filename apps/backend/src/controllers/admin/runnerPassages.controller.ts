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
import { RunnerService } from "../../services/database/entities/runner.service";

@Controller()
@UseGuards(AuthGuard)
export class RunnerPassagesController {
  constructor(
    private readonly passageService: PassageService,
    private readonly runnerService: RunnerService,
  ) {}

  @Post("/admin/runners/:runnerId/passages")
  async getRunnerPassages(
    @Param("runnerId") runnerId: string,
    @Body() passageDto: PassageDto,
  ): Promise<ApiResponse<PostRunnerPassageAdminApiRequest>> {
    const id = Number(runnerId);

    if (isNaN(id)) {
      throw new BadRequestException("RunnerId must be a number");
    }

    const runner = await this.runnerService.getRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    const passage = await this.passageService.createPassage({
      ...passageDto,
      runnerId: runner.id,
      detectionId: null,
      importTime: null,
    });

    return {
      passage: objectUtils.excludeKeys(passage, ["runnerId"]),
    };
  }

  @Patch("/admin/runners/:runnerId/passages/:passageId")
  async updateRunnerPassage(
    @Param("runnerId") runnerId: string,
    @Param("passageId") passageId: string,
    @Body() updatePassageDto: UpdatePassageDto,
  ): Promise<ApiResponse<PatchRunnerPassageAdminApiRequest>> {
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

    const updatedPassage = await this.passageService.updatePassage(pId, updatePassageDto);

    return {
      passage: objectUtils.excludeKeys(updatedPassage, ["runnerId"]),
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
