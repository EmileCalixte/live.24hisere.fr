import {RunnerService} from "./../services/database/entities/runner.service";
import {HttpService} from "@nestjs/axios";
import {Injectable} from "@nestjs/common";
import {AxiosError} from "axios";
import {catchError, firstValueFrom} from "rxjs";
import {TaskService} from "./taskService";
import {SchedulerRegistry} from "@nestjs/schedule";
import {ConfigService} from "src/services/database/entities/config.service";
import {PassageService} from "src/services/database/entities/passage.service";
import {DagFileService} from "src/services/dagFile.service";
import {DagFileLineData} from "src/types/Dag";

@Injectable()
export class ImportPassagesService extends TaskService {
    private static readonly taskName = "import-passages";
    private static readonly intervalEnvVar = "IMPORT_PASSAGES_TASK_CRON";

    constructor(
        private readonly configService: ConfigService,
        private readonly dagFileService: DagFileService,
        private readonly httpService: HttpService,
        private readonly passageService: PassageService,
        private readonly runnerService: RunnerService,
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

        this.logger.log(`Importing passages from dag file located to ${dagFileUrl}`);

        const {data} = await firstValueFrom(
            this.httpService.get("http://static:8080/dag-file.txt").pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error);
                    throw "An error occurred";
                }),
            ),
        );

        this.logger.log(`Successfully downloaded DAG file: ${data.length} bytes`);

        await this.importPassagesFromDagFileContent(data);

        this.logger.log("Done");
    }

    private async importPassagesFromDagFileContent(dagFileContent: string) {
        const lines = dagFileContent.split(/(\r\n|\n|\r)/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        this.logger.log(`Processing ${lines.length} lines`);

        const dagData = lines.map(line => this.dagFileService.getDataFromDagFileLine(line));

        await Promise.all(dagData.map(data => this.importPassageFromDagLineData(data)));
    }

    private async importPassageFromDagLineData(data: DagFileLineData): Promise<boolean> {
        const existingPassage = await this.passageService.getPassage({
            detectionId: data.detectionId,
        });

        if (existingPassage) {
            this.logger.verbose(`Passage with detection ID ${data.detectionId} already exists, skipping`);
            return false;
        }

        this.logger.verbose(`Importing passage with detection ID ${data.detectionId}`);

        const runner = await this.runnerService.getRunner({
            id: data.runnerId,
        });

        if (!runner) {
            this.logger.verbose(`Runner with ID ${data.runnerId} not found, skipping this detection`);
            return false;
        }

        await this.passageService.savePassage({
            detectionId: data.detectionId,
            runner: {
                connect: {
                    id: runner.id,
                },
            },
            time: data.passageDateTime,
            isHidden: false,
        });

        return true;
    }
}
