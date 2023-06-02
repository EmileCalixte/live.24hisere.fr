import {Runner} from "@prisma/client";
import {RunnerService} from "./../services/database/entities/runner.service";
import {Controller, Get} from "@nestjs/common";

interface RunnersResponse {
    runners: Runner[];
}

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
}
