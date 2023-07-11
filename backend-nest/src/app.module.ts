import { HttpModule } from "@nestjs/axios";
import { type MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { PassagesController } from "./controllers/admin/passages.controller";
import { UsersController } from "./controllers/admin/users.controller";
import { AuthController } from "./controllers/auth.controller";
import { RankingController } from "./controllers/ranking.controller";
import { AccessLoggerMiddleware } from "./middlewares/accessLogger.middleware";
import { PrismaService } from "./services/database/prisma.service";
import { AccessTokenService } from "./services/database/entities/accessToken.service";
import { AuthService } from "./services/auth.service";
import { PasswordService } from "./services/password.service";
import { RandomService } from "./services/random.service";
import { RankingService } from "./services/ranking.service";
import { ImportPassagesService } from "./tasks/importPassages.service";
import { UserService } from "./services/database/entities/user.service";
import { AppDataController } from "./controllers/appData.controller";
import { MiscService } from "./services/database/entities/misc.service";
import { ConfigService } from "./services/database/entities/config.service";
import { RacesController } from "./controllers/races.controller";
import { RaceService } from "./services/database/entities/race.service";
import { RunnerService } from "./services/database/entities/runner.service";
import { RunnersController } from "./controllers/runners.controller";
import { PassageService } from "./services/database/entities/passage.service";
import { DagFileService } from "./services/dagFile.service";

const appServices = [
    AuthService,
    DagFileService,
    PasswordService,
    RandomService,
    RankingService,
];

const databaseServices = [
    PrismaService,
    AccessTokenService,
    ConfigService,
    MiscService,
    PassageService,
    RaceService,
    RunnerService,
    UserService,
];

const tasksServices = [
    ImportPassagesService,
];

const publicControllers = [
    AppDataController,
    AuthController,
    RacesController,
    RankingController,
    RunnersController,
];

const adminControllers = [
    PassagesController,
    UsersController,
];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        { ...HttpModule.register({}), global: true },
    ],
    controllers: [
        ...publicControllers,
        ...adminControllers,
    ],
    providers: [
        ...appServices,
        ...databaseServices,
        ...tasksServices,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AccessLoggerMiddleware).forRoutes("*");
    }
}
