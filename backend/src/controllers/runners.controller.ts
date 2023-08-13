import { type RunnerResponse, type RunnersResponse } from "../types/responses/Runners";
import { RunnerService } from "../services/database/entities/runner.service";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";

@Controller()
export class RunnersController {
    constructor(
        private readonly runnerService: RunnerService,
    ) {}

    @Get("/runners")
    async getRunners(): Promise<RunnersResponse> {
        const runners = await this.runnerService.getPublicRunners();

        return {
            runners,
        };
    }

    @Get("/runners/:runnerId")
    async getRunner(@Param("runnerId") runnerId: string): Promise<RunnerResponse> {
        const id = Number(runnerId);

        if (isNaN(id)) {
            throw new BadRequestException("Runner ID must be a number");
        }

        const runner = await this.runnerService.getPublicRunner({ id });

        if (!runner) {
            throw new NotFoundException("Runner not found");
        }

        return {
            runner,
        };
    }
}
