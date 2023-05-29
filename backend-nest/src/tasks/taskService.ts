import {Logger} from "@nestjs/common";
import {SchedulerRegistry} from "@nestjs/schedule";
import {CronJob} from "cron";

export abstract class TaskService {
    protected readonly logger;

    constructor(
        protected readonly schedulerRegistry: SchedulerRegistry,
    ) {
        this.logger = new Logger(`Tasks - ${this.getTaskName()}`);

        const cronTime = this.getCronTime();

        if (cronTime === false) {
            this.logger.log(`Interval for task ${this.getTaskName()} not defined, skipping`);
            return;
        }

        this.logger.log(`Enabling task ${this.getTaskName()}`);

        const job = new CronJob(cronTime, this.task.bind(this));

        this.schedulerRegistry.addCronJob(this.getTaskName(), job);
        job.start();
    }

    /**
     * The function to execute periodically
     */
    protected abstract task(): void;

    protected abstract getTaskName(): string;

    protected abstract getIntervalEnvVarName(): string;

    protected getCronTime(): ConstructorParameters<typeof CronJob>[0]["cronTime"] | false {
        const cronTime = process.env[this.getIntervalEnvVarName()];

        if (cronTime === undefined) {
            return false;
        }

        return cronTime;
    }
}
