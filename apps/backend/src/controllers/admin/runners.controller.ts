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
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  GetRaceRunnersAdminApiRequest,
  GetRunnerAdminApiRequest,
  GetRunnersAdminApiRequest,
  PatchRunnerAdminApiRequest,
  PostRunnerAdminApiRequest,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { RunnerDto } from "../../dtos/runner/runner.dto";
import { UpdateRunnerDto } from "../../dtos/runner/updateRunner.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { RaceService } from "../../services/database/entities/race.service";
import { RunnerService } from "../../services/database/entities/runner.service";

@Controller()
@UseGuards(AuthGuard)
export class RunnersController {
  constructor(
    private readonly raceService: RaceService,
    private readonly runnerService: RunnerService,
  ) {}

  @Get("/admin/runners")
  async getRunners(): Promise<ApiResponse<GetRunnersAdminApiRequest>> {
    const runners = await this.runnerService.getAdminRunners();

    return {
      runners,
    };
  }

  @Post("/admin/runners")
  async createRunner(@Body() runnerDto: RunnerDto): Promise<ApiResponse<PostRunnerAdminApiRequest>> {
    const runner = await this.runnerService.createRunner({
      ...objectUtils.instanceToObject(runnerDto),
      birthYear: runnerDto.birthYear.toString(),
    });

    return {
      runner,
    };
  }

  // @Post("/admin/runners-bulk")
  // async createRunnersBulk(
  //   @Body(new ParseArrayPipe({ items: RunnerDto })) runnerDtos: RunnerDto[],
  // ): Promise<ApiResponse<PostRunnersBulkAdminApiRequest>> {
  //   await Promise.all(
  //     runnerDtos.map(async (dto) => {
  //       await this.ensureRunnerIdDoesNotExist(dto.id);
  //     }),
  //   );

  //   const ids = new Set();

  //   for (const dto of runnerDtos) {
  //     if (ids.has(dto.id)) {
  //       throw new BadRequestException("Duplicate IDs");
  //     }

  //     ids.add(dto.id);
  //   }

  //   const createdRunnersCount = await this.runnerService.createRunners(
  //     runnerDtos.map((dto) => ({
  //       ...dto,
  //       birthYear: dto.birthYear.toString(),
  //     })),
  //   );

  //   return {
  //     count: createdRunnersCount,
  //   };
  // }

  @Get("/admin/runners/:runnerId")
  async getRunner(@Param("runnerId") runnerId: string): Promise<ApiResponse<GetRunnerAdminApiRequest>> {
    const id = Number(runnerId);

    if (isNaN(id)) {
      throw new BadRequestException("Runner ID must be a number");
    }

    const runner = await this.runnerService.getAdminRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    return {
      runner,
    };
  }

  @Patch("/admin/runners/:runnerId")
  async updateRunner(
    @Param("runnerId") runnerId: string,
    @Body() updateRunnerDto: UpdateRunnerDto,
  ): Promise<ApiResponse<PatchRunnerAdminApiRequest>> {
    const id = Number(runnerId);

    if (isNaN(id)) {
      throw new BadRequestException("Runner ID must be a number");
    }

    const runner = await this.runnerService.getAdminRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    const updateRunnerData: Parameters<RunnerService["updateRunner"]>[1] = objectUtils.excludeKeys(updateRunnerDto, [
      "birthYear",
    ]);

    if (updateRunnerDto.birthYear) {
      updateRunnerData.birthYear = updateRunnerDto.birthYear.toString();
    }

    if (updateRunnerData.birthYear === undefined) {
      delete updateRunnerData.birthYear;
    }

    const updatedRunner = await this.runnerService.updateRunner(runner.id, updateRunnerData);

    return {
      runner: updatedRunner,
    };
  }

  @Delete("/admin/runners/:runnerId")
  @HttpCode(204)
  async deleteRunner(@Param("runnerId") runnerId: string): Promise<void> {
    const id = Number(runnerId);

    if (isNaN(id)) {
      throw new BadRequestException("Runner ID must be a number");
    }

    const runner = await this.runnerService.getAdminRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    await this.runnerService.deleteRunner(id);
  }

  @Get("/admin/races/:raceId/runners")
  async getRaceRunners(@Param("raceId") raceId: string): Promise<ApiResponse<GetRaceRunnersAdminApiRequest>> {
    const id = Number(raceId);

    if (isNaN(id)) {
      throw new BadRequestException("Race ID must be a number");
    }

    const race = await this.raceService.getAdminRaceById(id);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    return { runners: await this.runnerService.getAdminRaceRunners(race.id) };
  }
}
