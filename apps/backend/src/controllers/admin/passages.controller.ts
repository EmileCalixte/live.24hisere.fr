import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { PassageService } from "../../services/database/entities/passage.service";
import { QueryParam } from "../../types/QueryParam";
import { PassagesResponse } from "../../types/responses/admin/Passages";
import { isDefined } from "../../utils/misc.utils";

@Controller()
@UseGuards(AuthGuard)
export class PassagesController {
    constructor(
        private readonly passageService: PassageService,
    ) {}

    @Get("/admin/passages")
    async getPassages(@Query("excludeHidden") excludeHidden: QueryParam): Promise<PassagesResponse> {
        const passages = isDefined(excludeHidden)
            ? await this.passageService.getAllPublicPassages()
            : await this.passageService.getAllPassages();

        return { passages };
    }
}
