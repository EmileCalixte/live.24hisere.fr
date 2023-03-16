import {Controller, Get} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {AppService} from "./app.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    getHello(): string {
        const testEnvVar = this.configService.get<string>("TEST");

        return this.appService.getHello(testEnvVar ?? "");
    }
}
