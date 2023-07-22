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
import { RunnerDto } from "../../dtos/runner/runner.dto";
import { UpdateRunnerDto } from "../../dtos/runner/updateRunner.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { RunnerService } from "../../services/database/entities/runner.service";
import {
    type AdminRunnerWithPassagesResponse,
    type AdminRunnersResponse,
    type AdminRunnerResponse,
} from "../../types/responses/admin/Runner";
import { excludeKeys } from "../../utils/misc.utils";

@Controller()
@UseGuards(AuthGuard)
export class RunnersController {
    constructor(
        private readonly runnerService: RunnerService,
    ) {}

    @Get("/admin/runners")
    async getRunners(): Promise<AdminRunnersResponse> {
        const runners = await this.runnerService.getRunners();

        return {
            runners,
        };
    }

    @Post("/admin/runners")
    async createRunner(@Body() runnerDto: RunnerDto): Promise<AdminRunnerWithPassagesResponse> {
        const runner = await this.runnerService.createRunner(excludeKeys({
            ...runnerDto,
            birthYear: runnerDto.birthYear.toString(),
            race: {
                connect: {
                    id: runnerDto.raceId,
                },
            },
        }, ["raceId"]));

        return {
            runner: {
                ...runner,
                passages: [],
            },
        };
    }

    @Get("/admin/runners/:runnerId")
    async getRunner(@Param("runnerId") runnerId: string): Promise<AdminRunnerWithPassagesResponse> {
        const id = Number(runnerId);

        if (isNaN(id)) {
            throw new BadRequestException("RunnerId must be a number");
        }

        const runner = await this.runnerService.getAdminRunner({ id });

        if (!runner) {
            throw new NotFoundException("Runner not found");
        }

        return {
            runner,
        };
    }

    @Patch("/admin/runners/:runnerId")
    async updateRunner(@Param("runnerId") runnerId: string, @Body() updateRunnerDto: UpdateRunnerDto): Promise<AdminRunnerResponse> {
        const id = Number(runnerId);

        if (isNaN(id)) {
            throw new BadRequestException("RunnerId must be a number");
        }

        const runner = await this.runnerService.getRunner({ id });

        if (!runner) {
            throw new NotFoundException("Runner not found");
        }

        const updateRunnerData: Parameters<RunnerService["updateRunner"]>[1] = excludeKeys(updateRunnerDto, ["raceId", "birthYear"]);

        if (updateRunnerDto.birthYear) {
            updateRunnerData.birthYear = updateRunnerDto.birthYear.toString();
        }

        if (updateRunnerDto.raceId) {
            updateRunnerData.race = { connect: { id: updateRunnerDto.raceId } };
        }

        if (updateRunnerData.birthYear === undefined) {
            delete updateRunnerData.birthYear;
        }

        const updatedRunner = await this.runnerService.updateRunner(runner, updateRunnerData);

        return {
            runner: updatedRunner,
        };
    }
}
