import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { DagFileService } from "src/services/dagFile.service";
import { ConfigService } from "src/services/database/entities/config.service";
import { PassageService } from "src/services/database/entities/passage.service";
import { DagFileLineData } from "src/types/Dag";
import { MiscService } from "../services/database/entities/misc.service";
import { RunnerService } from "../services/database/entities/runner.service";
import { TaskService } from "./taskService";

@Injectable()
export class ImportPassagesService extends TaskService {
    private static readonly taskName = "import-passages";
    private static readonly intervalEnvVar = "IMPORT_PASSAGES_TASK_CRON";

    constructor(
        private readonly configService: ConfigService,
        private readonly miscService: MiscService,
        private readonly dagFileService: DagFileService,
        private readonly httpService: HttpService,
        private readonly passageService: PassageService,
        private readonly runnerService: RunnerService,
        protected readonly schedulerRegistry: SchedulerRegistry,
    ) {
        super(schedulerRegistry);
    }

    protected getIntervalEnvVarName(): string {
        return ImportPassagesService.intervalEnvVar;
    }

    protected getTaskName(): string {
        return ImportPassagesService.taskName;
    }

    protected async task(): Promise<void> {
        const dagFileUrl = await this.configService.getImportDagFilePath();

        if (!dagFileUrl) {
            this.logger.log(
                "URL to dag file not defined, skipping passages import",
            );
            return;
        }

        this.logger.log(
            `Importing passages from dag file located at ${dagFileUrl}`,
        );

        const { data } = await firstValueFrom(
            this.httpService.get<string>(dagFileUrl).pipe(
                catchError((error: AxiosError) => {
                    throw new Error(
                        `An error occurred while fetching dag file: ${error.message}`,
                    );
                }),
            ),
        );

        this.logger.log(
            `Successfully downloaded DAG file: ${data.length} bytes`,
        );

        await this.importPassagesFromDagFileContent(data);

        await this.miscService.saveLastUpdateTime(new Date());

        this.logger.log("Done");
    }

    private async importPassagesFromDagFileContent(
        dagFileContent: string,
    ): Promise<void> {
        const lines = dagFileContent
            .split(/(\r\n|\n|\r)/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        this.logger.log(`Processing ${lines.length} lines`);

        const dagData = lines.map((line) =>
            this.dagFileService.getDataFromDagFileLine(line),
        );

        const results = await Promise.all(
            dagData.map(
                async (data) => await this.importPassageFromDagLineData(data),
            ),
        );

        const importedPassageCount = results.filter(Boolean).length;

        this.logger.log(`Imported ${importedPassageCount} passages`);
    }

    private async importPassageFromDagLineData(
        data: DagFileLineData,
    ): Promise<boolean> {
        const existingPassage = await this.passageService.getPassage({
            detectionId: data.detectionId,
        });

        if (existingPassage) {
            return false;
        }

        const runner = await this.runnerService.getRunner({
            id: data.runnerId,
        });

        if (!runner) {
            this.logger.verbose(
                `Runner with ID ${data.runnerId} not found, skipping detection with ID ${data.detectionId}`,
            );
            return false;
        }

        this.logger.verbose(
            `Importing passage with detection ID ${data.detectionId}`,
        );

        await this.passageService.createPassage({
            detectionId: data.detectionId,
            importTime: new Date(),
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
