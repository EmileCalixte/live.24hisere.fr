import {Controller, Get} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {AppService} from "./app.service";
import {UserService} from "./services/database/entities/user.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    @Get("/")
    async getHello(): Promise<string> {
        const testEnvVar = this.configService.get<string>("TEST");

        console.log(await this.userService.getUser({username: "admin"}));

        return this.appService.getHello(testEnvVar ?? "");
    }
}
