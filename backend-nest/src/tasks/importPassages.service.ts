import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";

// TODO move this function somewhere else
function getTaksInfo(intervalEnvVar: string | undefined): [string, boolean] {
    if (intervalEnvVar === undefined) {
        return ["", false];
    }

    return [intervalEnvVar, true];
}

// TODO log enabled tasks
const [importPassagesTaskInterval, isImportPassagesTaskEnabled] = getTaksInfo(process.env.IMPORT_PASSAGES_TASK_CRON);

@Injectable()
export class ImportPassagesService {
    private readonly logger = new Logger("Tasks");

    @Cron(importPassagesTaskInterval, {
        disabled: !isImportPassagesTaskEnabled,
    })
    importPassages() {
        this.logger.log(`Test cron ${new Date().toISOString()}`);
    }
}
