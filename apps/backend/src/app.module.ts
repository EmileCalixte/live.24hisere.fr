import { HttpModule } from "@nestjs/axios";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { dependencies } from "./dependencies";
import { AccessLoggerMiddleware } from "./middlewares/accessLogger.middleware";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
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
