import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { typeUtils } from "@live24hisere/utils";
import { AuthGuard } from "../../guards/auth.guard";
import { PassageService } from "../../services/database/entities/passage.service";
import { QueryParam } from "../../types/QueryParam";
import { PassagesResponse } from "../../types/responses/admin/Passages";

@Controller()
@UseGuards(AuthGuard)
export class PassagesController {
    constructor(private readonly passageService: PassageService) {}

    @Get("/admin/passages")
    async getPassages(
        @Query("excludeHidden") excludeHidden: QueryParam,
    ): Promise<PassagesResponse> {
        const passages = typeUtils.isDefined(excludeHidden)
            ? await this.passageService.getAllPublicPassages()
            : await this.passageService.getAllPassages();

        return { passages };
    }
}
