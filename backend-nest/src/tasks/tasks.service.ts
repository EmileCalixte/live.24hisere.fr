import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class TasksService {

    @Cron("0,20,40 * * * * *")
    // @Interval(20000)
    testCron() {
        console.log("Test cron", new Date());
    }
}
