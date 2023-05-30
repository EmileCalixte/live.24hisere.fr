import {HttpModule} from "@nestjs/axios";
import {MiddlewareConsumer, Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {AuthController} from "./controllers/auth.controller";
import {AccessLoggerMiddleware} from "./middlewares/accessLogger.middleware";
import {PrismaService} from "./services/database/prisma.service";
import {AccessTokenService} from "./services/database/entities/accessToken.service";
import {AuthService} from "./services/auth.service";
import {PasswordService} from "./services/password.service";
import {RandomService} from "./services/random.service";
import {ImportPassagesService} from "./tasks/importPassages.service";
import {UserService} from "./services/database/entities/user.service";
import {AppDataController} from "./controllers/appData.controller";
import {MiscService} from "./services/database/entities/misc.service";

const appServices = [
    AuthService,
    PasswordService,
    RandomService,
];

const databaseServices = [
    PrismaService,
    AccessTokenService,
    MiscService,
    UserService,
];

const tasksServices = [
    ImportPassagesService,
];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        {...HttpModule.register({}), global: true},
    ],
    controllers: [
        AppDataController,
        AuthController,
    ],
    providers: [
        ...appServices,
        ...databaseServices,
        ...tasksServices,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AccessLoggerMiddleware).forRoutes("*");
    }
}
