import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UpdateDisabledAppDto } from "../../dtos/disabledApp/updateDisabledApp.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { ConfigService } from "../../services/database/entities/config.service";
import { type AdminDisabledAppResponse } from "../../types/responses/admin/DisabledApp";
import { isNullOrUndefined } from "../../utils/misc.utils";

@Controller()
@UseGuards(AuthGuard)
export class DisabledAppController {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    @Get("/admin/disabled-app")
    async getDisabledApp(): Promise<AdminDisabledAppResponse> {
        return this.getDisabledAppData();
    }

    @Patch("/admin/disabled-app")
    async updateDisabledApp(@Body() updateDisabledAppDto: UpdateDisabledAppDto): Promise<AdminDisabledAppResponse> {
        console.log(updateDisabledAppDto);

        const promises = [];

        if (!isNullOrUndefined(updateDisabledAppDto.isAppEnabled)) {
            promises.push(this.configService.setIsAppEnabled(updateDisabledAppDto.isAppEnabled));
        }

        if (!isNullOrUndefined(updateDisabledAppDto.disabledAppMessage)) {
            promises.push(this.configService.setDisabledAppMessage(updateDisabledAppDto.disabledAppMessage));
        }

        await Promise.all(promises);

        return this.getDisabledAppData();
    }

    private async getDisabledAppData(): Promise<AdminDisabledAppResponse> {
        const [
            isAppEnabled,
            disabledAppMessage,
        ] = await Promise.all([
            this.configService.getIsAppEnabled(),
            this.configService.getDisabledAppMessage(),
        ]);

        return {
            isAppEnabled: isAppEnabled ?? false,
            disabledAppMessage,
        };
    }
}
