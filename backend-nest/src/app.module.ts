import {MiddlewareConsumer, Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {AuthController} from "./controllers/auth.controller";
import {AccessLoggerMiddleware} from "./middlewares/accessLogger.middleware";
import {PrismaService} from "./services/database/prisma.service";
import {AccessTokenService} from "./services/database/entities/accessToken.service";
import {AuthService} from "./services/auth.service";
import {PasswordService} from "./services/password.service";
import {RandomService} from "./services/random.service";
import {TasksService} from "./tasks/tasks.service";
import {UserService} from "./services/database/entities/user.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        ScheduleModule.forRoot(),
    ],
    controllers: [
        AppController,
        AuthController,
    ],
    providers: [
        AppService,

        PrismaService,
        AccessTokenService,
        UserService,

        AuthService,
        PasswordService,
        RandomService,

        TasksService,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AccessLoggerMiddleware).forRoutes("*");
    }
}
