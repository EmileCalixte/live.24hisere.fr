import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { RunnerDto } from "../../dtos/runner/runner.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { RunnerService } from "../../services/database/entities/runner.service";
import { type AdminRunnerResponse, type AdminRunnersResponse } from "../../types/responses/admin/Runner";
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
    async createRunner(@Body() runnerDto: RunnerDto): Promise<AdminRunnerResponse> {
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
    async getRunner(@Param("runnerId") runnerId: string): Promise<AdminRunnerResponse> {
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
}
