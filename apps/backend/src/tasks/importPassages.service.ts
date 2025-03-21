import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { AdminRace, PassageImportRule } from "@live24hisere/core/types";
import { arrayUtils } from "@live24hisere/utils";
import { DagFileService } from "../services/dagFile.service";
import { MiscService } from "../services/database/entities/misc.service";
import { PassageService } from "../services/database/entities/passage.service";
import { PassageImportRuleService } from "../services/database/entities/passageImportRule.service";
import { RaceService } from "../services/database/entities/race.service";
import { RunnerService } from "../services/database/entities/runner.service";
import { TaskService } from "./taskService";

const IMPORT_PASSAGES_CHUNK_SIZE = 500;

@Injectable()
export class ImportPassagesService extends TaskService {
  private static readonly taskName = "import-passages";
  private static readonly intervalEnvVar = "IMPORT_PASSAGES_TASK_CRON";

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    private readonly dagFileService: DagFileService,
    private readonly httpService: HttpService,
    private readonly miscService: MiscService,
    private readonly passageImportRuleService: PassageImportRuleService,
    private readonly passageService: PassageService,
    private readonly raceService: RaceService,
    private readonly runnerService: RunnerService,
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
    const passageImportRules = await this.passageImportRuleService.getActiveRules();

    const passageImportRuleCount = passageImportRules.length;

    if (passageImportRuleCount < 1) {
      this.logger.log("No passage import rule defined. Nothing to do.");
      return;
    }

    this.logger.log(
      `${passageImportRuleCount} active passage import rule${passageImportRuleCount > 1 ? "s" : ""} found`,
    );

    for (const passageImportRule of passageImportRules) {
      await this.handlePassageImportRule(passageImportRule);
    }

    await this.miscService.saveLastUpdateTime(new Date());

    this.logger.log("Done");
  }

  private async handlePassageImportRule(passageImportRule: PassageImportRule): Promise<void> {
    this.logger.log(`Handling passage import rule for URL ${passageImportRule.url}`);

    const races = await this.raceService.getPassageImportRuleAdminRaces(passageImportRule.id);

    const raceCount = races.length;

    if (raceCount < 1) {
      this.logger.log(`Rule for URL ${passageImportRule.url} is not linked to any race. Skipping`);
      return;
    }

    this.logger.log(`Rule for URL ${passageImportRule.url} is linked to ${raceCount} race${raceCount > 1 ? "s" : ""}`);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<string>(passageImportRule.url).pipe(
          catchError((error: AxiosError) => {
            throw new Error(`An error occurred while fetching dag file: ${error.message}`);
          }),
        ),
      );

      this.logger.log(`Successfully downloaded DAG file: ${data.length} bytes`);

      await this.importPassagesFromDagFileContent(data, races);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async importPassagesFromDagFileContent(dagFileContent: string, races: AdminRace[]): Promise<void> {
    const lines = dagFileContent
      .split(/(\r\n|\n|\r)/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    this.logger.log(`Processing ${lines.length} lines in chunks of ${IMPORT_PASSAGES_CHUNK_SIZE}`);

    const dagData = lines.map((line) => this.dagFileService.getDataFromDagFileLine(line));
    let totalImported = 0;

    const importTime = new Date();

    for (const chunk of arrayUtils.chunk(dagData, IMPORT_PASSAGES_CHUNK_SIZE)) {
      totalImported += await this.passageService.importDagDetections(
        chunk,
        races.map((race) => race.id),
        importTime,
      );
    }

    this.logger.log(`Imported ${totalImported} passages`);
  }
}
