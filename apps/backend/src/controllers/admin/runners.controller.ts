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
import { RunnerDto } from "../../dtos/runner/runner.dto";
import { UpdateRunnerDto } from "../../dtos/runner/updateRunner.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { RunnerService } from "../../services/database/entities/runner.service";
import {
    AdminRunnerResponse,
    AdminRunnersResponse,
    AdminRunnerWithPassagesResponse,
} from "../../types/responses/admin/Runner";
import { CountResponse } from "../../types/responses/Misc";
import { excludeKeys } from "../../utils/misc.utils";

@Controller()
@UseGuards(AuthGuard)
export class RunnersController {
    constructor(private readonly runnerService: RunnerService) {}

    @Get("/admin/runners")
    async getRunners(): Promise<AdminRunnersResponse> {
        const runners = await this.runnerService.getAdminRunners();

        return {
            runners,
        };
    }

    @Post("/admin/runners")
    async createRunner(
        @Body() runnerDto: RunnerDto,
    ): Promise<AdminRunnerWithPassagesResponse> {
        await this.ensureRunnerIdDoesNotExist(runnerDto.id);

        const runner = await this.runnerService.createRunner({
            ...runnerDto,
            birthYear: runnerDto.birthYear.toString(),
        });

        return {
            runner: {
                ...runner,
                passages: [],
            },
        };
    }

    @Post("/admin/runners-bulk")
    async createRunnersBulk(
        @Body(new ParseArrayPipe({ items: RunnerDto })) runnerDtos: RunnerDto[],
    ): Promise<CountResponse> {
        await Promise.all(
            runnerDtos.map(async (dto) => {
                await this.ensureRunnerIdDoesNotExist(dto.id);
            }),
        );

        const ids = new Set();

        for (const dto of runnerDtos) {
            if (ids.has(dto.id)) {
                throw new BadRequestException("Duplicate IDs");
            }

            ids.add(dto.id);
        }

        const createdRunnersCount = await this.runnerService.createRunners(
            runnerDtos.map((dto) => ({
                ...dto,
                birthYear: dto.birthYear.toString(),
            })),
        );

        return {
            count: createdRunnersCount,
        };
    }

    @Get("/admin/runners/:runnerId")
    async getRunner(
        @Param("runnerId") runnerId: string,
    ): Promise<AdminRunnerWithPassagesResponse> {
        const id = Number(runnerId);

        if (isNaN(id)) {
            throw new BadRequestException("RunnerId must be a number");
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
    ): Promise<AdminRunnerResponse> {
        const id = Number(runnerId);

        if (isNaN(id)) {
            throw new BadRequestException("RunnerId must be a number");
        }

        const runner = await this.runnerService.getRunnerById(id);

        if (!runner) {
            throw new NotFoundException("Runner not found");
        }

        if (updateRunnerDto.id && id !== updateRunnerDto.id) {
            await this.ensureRunnerIdDoesNotExist(updateRunnerDto.id);
        }

        const updateRunnerData: Parameters<RunnerService["updateRunner"]>[1] =
            excludeKeys(updateRunnerDto, ["birthYear"]);

        if (updateRunnerDto.birthYear) {
            updateRunnerData.birthYear = updateRunnerDto.birthYear.toString();
        }

        if (updateRunnerData.birthYear === undefined) {
            delete updateRunnerData.birthYear;
        }

        const updatedRunner = await this.runnerService.updateRunner(
            runner.id,
            updateRunnerData,
        );

        return {
            runner: updatedRunner,
        };
    }

    @Delete("/admin/runners/:runnerId")
    @HttpCode(204)
    async deleteRunner(@Param("runnerId") runnerId: string): Promise<void> {
        const id = Number(runnerId);

        if (isNaN(id)) {
            throw new BadRequestException("RunnerId must be a number");
        }

        const runner = await this.runnerService.getRunnerById(id);

        if (!runner) {
            throw new NotFoundException("Runner not found");
        }

        await this.runnerService.deleteRunner(id);
    }

    private async ensureRunnerIdDoesNotExist(id: number): Promise<void> {
        const existingRunner = await this.runnerService.getRunnerById(id);

        if (existingRunner) {
            throw new BadRequestException(
                "A runner with the same ID already exists",
            );
        }
    }
}
