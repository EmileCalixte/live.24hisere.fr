import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { config } from "drizzle/schema";
import { Config } from "src/types/Config";
import { booleanToString, stringToBoolean } from "../../../utils/db.utils";
import { EntityService } from "../entity.service";

const KEY_IMPORT_DAG_FILE_PATH = "import_dag_file_path";
const KEY_IS_APP_ENABLED = "is_app_enabled";
const KEY_DISABLED_APP_MESSAGE = "disabled_app_message";

@Injectable()
export class ConfigService extends EntityService {
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

    private async getLine(key: string): Promise<Config | null> {
        const configs = await this.db
            .select()
            .from(config)
            .where(eq(config.key, key));

        return this.getUniqueResult(configs);
    }

    /**
     * Updates a line or create it if it doesn't exist
     * @param key The key of the line to save
     * @param value The value to save
     * @returns The created or updated line
     */
    private async saveLine(key: string, value: string): Promise<Config> {
        await this.db
            .insert(config)
            .values({ key, value })
            .onDuplicateKeyUpdate({ set: { value } });

        const newLine = await this.getLine(key);

        if (!newLine) {
            throw new Error(
                `Failed to get updated config data from database (key: ${key})`,
            );
        }

        return newLine;
    }

    /**
     * Deletes a line
     * @param key The key of the line to delete
     * @returns true if the line was found and deleted, false otherwise
     */
    private async deleteLine(key: string): Promise<boolean> {
        const [resultSetHeader] = await this.db
            .delete(config)
            .where(eq(config.key, key));

        return !!resultSetHeader.affectedRows;
    }
}
