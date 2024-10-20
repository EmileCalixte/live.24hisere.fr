import { HttpModule } from "@nestjs/axios";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { NODE_ENV_TEST } from "./constants/env.constants";
import { dependencies } from "./dependencies";
import { AccessLoggerMiddleware } from "./middlewares/accessLogger.middleware";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === NODE_ENV_TEST ? ".env.test" : ".env",
        }),
        ScheduleModule.forRoot(),
        { ...HttpModule.register({}), global: true },
    ],
    controllers: [
        ...dependencies.controllers.public,
        ...dependencies.controllers.admin,
    ],
    providers: [
        ...dependencies.services.app,
        ...dependencies.services.database,
        ...dependencies.tasks,
        ...dependencies.validationRules,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AccessLoggerMiddleware).forRoutes("*");
    }
}
