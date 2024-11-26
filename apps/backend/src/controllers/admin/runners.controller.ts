import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  GetRunnerAdminApiRequest,
  GetRunnersAdminApiRequest,
  PatchRunnerAdminApiRequest,
  PostRunnerAdminApiRequest,
  PostRunnersBulkAdminApiRequest,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { RunnerDto } from "../../dtos/runner/runner.dto";
import { UpdateRunnerDto } from "../../dtos/runner/updateRunner.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { RunnerService } from "../../services/database/entities/runner.service";

@Controller()
@UseGuards(AuthGuard)
export class RunnersController {
  constructor(private readonly runnerService: RunnerService) {}

  @Get("/admin/runners")
  async getRunners(): Promise<ApiResponse<GetRunnersAdminApiRequest>> {
    const runners = await this.runnerService.getAdminRunners();

    return {
      runners,
    };
  }

  @Post("/admin/runners")
  async createRunner(@Body() runnerDto: RunnerDto): Promise<ApiResponse<PostRunnerAdminApiRequest>> {
    await this.ensureRunnerIdDoesNotExist(runnerDto.id);

    const runner = await this.runnerService.createRunner({
      ...runnerDto,
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

    const runner = await this.runnerService.getRunnerById(id);

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

    const runner = await this.runnerService.getRunnerById(id);

    if (!runner) {
      throw new NotFoundException("Runner not found");
    }

    await this.runnerService.deleteRunner(id);
  }
}
