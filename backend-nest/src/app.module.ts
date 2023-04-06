import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {PrismaService} from "./database/prisma.service";
import {TasksService} from "./tasks/tasks.service";
import {UserService} from "./user.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        PrismaService,
        UserService,

        TasksService,
    ],
})
export class AppModule {}
