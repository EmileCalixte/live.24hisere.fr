import {HttpService} from "@nestjs/axios";
import {Injectable} from "@nestjs/common";
import {AxiosError} from "axios";
import {catchError, firstValueFrom} from "rxjs";
import {TaskService} from "./taskService";
import {SchedulerRegistry} from "@nestjs/schedule";
import {ConfigService} from "src/services/database/entities/config.service";

@Injectable()
export class ImportPassagesService extends TaskService {
    private static readonly taskName = "import-passages";
    private static readonly intervalEnvVar = "IMPORT_PASSAGES_TASK_CRON";

    constructor(
        private readonly configService: ConfigService,
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
        const dagFileUrl = await this.configService.getImportDagFilePath();

        if (!dagFileUrl) {
            this.logger.log("URL to dag file not defined, skipping passages import");
            return;
        }

        this.logger.log(`Importing passages from dag file located to ${dagFileUrl} (TODO)`);

        const {data} = await firstValueFrom(
            this.httpService.get("http://static:8080/dag-file.txt").pipe(
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
