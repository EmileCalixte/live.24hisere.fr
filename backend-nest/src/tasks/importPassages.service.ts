import {HttpService} from "@nestjs/axios";
import {Injectable} from "@nestjs/common";
import {AxiosError} from "axios";
import {catchError, firstValueFrom} from "rxjs";
import {TaskService} from "./taskService";
import {SchedulerRegistry} from "@nestjs/schedule";

@Injectable()
export class ImportPassagesService extends TaskService {
    private static readonly taskName = "import-passages";
    private static readonly intervalEnvVar = "IMPORT_PASSAGES_TASK_CRON";

    constructor(
        private readonly httpService: HttpService,
        protected readonly schedulerRegistry: SchedulerRegistry,
    ) {
        super(schedulerRegistry);
    }

    protected getIntervalEnvVarName() {
        return ImportPassagesService.intervalEnvVar;
    }

    protected getTaskName(): string {
        return ImportPassagesService.taskName;
    }

    protected async task(): Promise<void> {
        this.logger.log(`Test cron ${new Date().toISOString()}`);

        const {data} = await firstValueFrom(
            this.httpService.get("https://example.com/").pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error);
                    throw "An error occurred";
                }),
            ),
        );

        console.log(data.length);

        this.logger.log("Done");
    }
}
