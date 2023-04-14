import {HttpService} from "@nestjs/axios";
import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {AxiosError} from "axios";
import {catchError, firstValueFrom} from "rxjs";

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

    constructor(private readonly httpService: HttpService) {}

    @Cron(importPassagesTaskInterval, {
        disabled: !isImportPassagesTaskEnabled,
    })
    async importPassages() {
        this.logger.log(`Test cron ${new Date().toISOString()}`);

        const {data} = await firstValueFrom(
            this.httpService.get("https://example.com/").pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error);
                    throw "An error occurred";
                })
            )
        );

        console.log(data.length);

        this.logger.log("Done");
    }
}
