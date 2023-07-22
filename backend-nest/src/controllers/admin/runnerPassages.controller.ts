import { BadRequestException, Body, Controller, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { PassageDto } from "../../dtos/passage/passage.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { PassageService } from "../../services/database/entities/passage.service";
import { RunnerService } from "../../services/database/entities/runner.service";
import { type AdminRunnerPassageResponse } from "../../types/responses/admin/RunnerPassage";
import { excludeKeys } from "../../utils/misc.utils";

@Controller()
@UseGuards(AuthGuard)
export class RunnerPassagesController {
    constructor(
        private readonly passageService: PassageService,
        private readonly runnerService: RunnerService,
    ) {}

    @Post("/admin/runners/:runnerId/passages")
    async getRunnerPassages(@Param("runnerId") runnerId: string, @Body() passageDto: PassageDto): Promise<AdminRunnerPassageResponse> {
        const id = Number(runnerId);

        if (isNaN(id)) {
            throw new BadRequestException("RunnerId must be a number");
        }

        const runner = await this.runnerService.getAdminRunner({ id });

        if (!runner) {
            throw new NotFoundException("Runner not found");
        }

        const passage = await this.passageService.createPassage({
            ...passageDto,
            runner: {
                connect: {
                    id: runner.id,
                },
            },
        });

        return {
            passage: excludeKeys(passage, ["runnerId"]),
        };
    }
}
