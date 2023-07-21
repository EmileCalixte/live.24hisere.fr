import { BadRequestException, Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { RunnerService } from "../../services/database/entities/runner.service";
import { type AdminRunnerResponse, type AdminRunnersResponse } from "../../types/responses/admin/Runner";

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
