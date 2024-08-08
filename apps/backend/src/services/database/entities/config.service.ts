import { Injectable } from "@nestjs/common";
import { Config, Prisma } from "@prisma/client";
import { booleanToString, stringToBoolean } from "../../../utils/db.utils";
import { PrismaService } from "../prisma.service";

const KEY_IMPORT_DAG_FILE_PATH = "import_dag_file_path";
const KEY_IS_APP_ENABLED = "is_app_enabled";
const KEY_DISABLED_APP_MESSAGE = "disabled_app_message";

@Injectable()
export class ConfigService {
    constructor(private readonly prisma: PrismaService) {}

    public async getImportDagFilePath(): Promise<string | null> {
        const config = await this.getLine(KEY_IMPORT_DAG_FILE_PATH);

        return config?.value ?? null;
    }

    public async setImportDagFilePath(
        dagFileUrl: string | null,
    ): Promise<void> {
        if (!dagFileUrl) {
            await this.deleteLine(KEY_IMPORT_DAG_FILE_PATH);
            return;
        }

        await this.saveLine(KEY_IMPORT_DAG_FILE_PATH, dagFileUrl.trim());
    }

    public async getIsAppEnabled(): Promise<boolean | null> {
        const config = await this.getLine(KEY_IS_APP_ENABLED);

        if (config?.value === undefined) {
            return null;
        }

        return stringToBoolean(config.value);
    }

    public async setIsAppEnabled(isAppEnabled: boolean): Promise<void> {
        await this.saveLine(KEY_IS_APP_ENABLED, booleanToString(isAppEnabled));
    }

    public async getDisabledAppMessage(): Promise<string | null> {
        const config = await this.getLine(KEY_DISABLED_APP_MESSAGE);

        return config?.value ?? null;
    }

    public async setDisabledAppMessage(message: string): Promise<void> {
        await this.saveLine(KEY_DISABLED_APP_MESSAGE, message);
    }

    private async getLine(
        key: NonNullable<Prisma.ConfigWhereUniqueInput["key"]>,
    ): Promise<Config | null> {
        return await this.prisma.config.findUnique({
            where: { key },
        });
    }

    private async saveLine(
        key: NonNullable<Prisma.ConfigWhereUniqueInput["key"]>,
        value: Config["value"],
    ): Promise<Config> {
        return await this.prisma.config.upsert({
            where: {
                key,
            },
            update: {
                value,
            },
            create: {
                key,
                value,
            },
        });
    }

    private async deleteLine(
        key: NonNullable<Prisma.ConfigWhereUniqueInput["key"]>,
    ): Promise<void> {
        await this.prisma.config.delete({
            where: { key },
        });
    }
}
