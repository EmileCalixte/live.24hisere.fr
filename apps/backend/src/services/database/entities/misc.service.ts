import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { TABLE_MISC } from "drizzle/schema";
import { DateISOString } from "src/types/Date";
import { Misc } from "src/types/Misc";
import { isDateValid } from "src/utils/date.utils";
import { EntityService } from "../entity.service";

const KEY_LAST_UPDATE_TIME = "last_update_time";

@Injectable()
export class MiscService extends EntityService {
    public async getLastUpdateTime(): Promise<Date | null>;
    public async getLastUpdateTime(asISOString: false): Promise<Date | null>;
    public async getLastUpdateTime(
        asISOString: true,
    ): Promise<DateISOString | null>;
    public async getLastUpdateTime(
        asISOString = false,
    ): Promise<Date | DateISOString | null> {
        const misc = await this.getLine(KEY_LAST_UPDATE_TIME);

        if (!misc) {
            return null;
        }

        const date = new Date(misc.value);

        if (!isDateValid(date)) {
            return null;
        }

        return asISOString ? date.toISOString() : date;
    }

    public async saveLastUpdateTime(lastUpdateDate: Date): Promise<void> {
        await this.saveLine(KEY_LAST_UPDATE_TIME, lastUpdateDate.toISOString());
    }

    private async getLine(key: string): Promise<Misc | null> {
        const miscs = await this.db
            .select()
            .from(TABLE_MISC)
            .where(eq(TABLE_MISC.key, key));

        return this.getUniqueResult(miscs);
    }

    /**
     * Updates a line or create it if it doesn't exist
     * @param key The key of the line to save
     * @param value The value to save
     * @returns The created or updated line
     */
    private async saveLine(key: string, value: string): Promise<Misc> {
        await this.db
            .insert(TABLE_MISC)
            .values({ key, value })
            .onDuplicateKeyUpdate({ set: { value } });

        const newLine = await this.getLine(key);

        if (!newLine) {
            throw new Error(
                `Failed to get updated misc data from database (key: ${key})`,
            );
        }

        return newLine;
    }
}
