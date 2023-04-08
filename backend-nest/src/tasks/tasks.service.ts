import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class TasksService {
    private readonly logger = new Logger("Tasks");

    @Cron("0,20,40 * * * * *")
    // @Interval(20000)
    testCron() {
        this.logger.log(`Test cron ${new Date().toISOString()}`);
    }
}
