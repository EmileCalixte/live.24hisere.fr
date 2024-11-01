import { Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

export abstract class TaskService {
  protected readonly logger;

  private executionInProgress = false;
  private previousExecutionStartTime: Date | null = null;

  protected constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly preventOverlapping: boolean = true,
  ) {
    this.logger = new Logger(`Tasks - ${this.getTaskName()}`);

    const cronTime = this.getCronTime();

    if (cronTime === false) {
      this.logger.log(`Interval for task ${this.getTaskName()} not defined, skipping`);
      return;
    }

    this.logger.log(`Enabling task ${this.getTaskName()}`);

    const job = new CronJob(cronTime, this.executeTask.bind(this));

    this.schedulerRegistry.addCronJob(this.getTaskName(), job);
    job.start();
  }

  /**
   * The function to execute periodically
   */
  protected abstract task(): Promise<void>;

  protected abstract getTaskName(): string;

  protected abstract getIntervalEnvVarName(): string;

  protected getCronTime(): ConstructorParameters<typeof CronJob>[0] | false {
    const cronTime = process.env[this.getIntervalEnvVarName()];

    if (cronTime === undefined) {
      return false;
    }

    return cronTime;
  }

  private executeTask(): void {
    if (this.executionInProgress && this.preventOverlapping) {
      this.logger.log(
        `Previous execution is still in progress (started at ${this.previousExecutionStartTime?.toISOString() ?? "unknown time"}), skipping this one`,
      );
      return;
    }

    this.executionInProgress = true;
    this.previousExecutionStartTime = new Date();

    this.task()
      .catch((error) => {
        this.logger.error(error);
      })
      .finally(() => {
        this.executionInProgress = false;
      });
  }
}
