import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { typeUtils } from "@live24hisere/utils";
import { TABLE_CONFIG } from "../../../../drizzle/schema";
import { Config } from "../../../types/Config";
import { EntityService } from "../entity.service";

const KEY_IS_APP_ENABLED = "is_app_enabled";
const KEY_DISABLED_APP_MESSAGE = "disabled_app_message";
const KEY_CURRENT_EDITION_ID = "current_edition_id";

@Injectable()
export class ConfigService extends EntityService {
  public async getIsAppEnabled(): Promise<boolean | null> {
    const config = await this.getLine(KEY_IS_APP_ENABLED);

    if (config?.value === undefined) {
      return null;
    }

    return typeUtils.stringToBoolean(config.value);
  }

  public async setIsAppEnabled(isAppEnabled: boolean): Promise<void> {
    await this.saveLine(KEY_IS_APP_ENABLED, typeUtils.booleanToString(isAppEnabled));
  }

  public async getDisabledAppMessage(): Promise<string | null> {
    const config = await this.getLine(KEY_DISABLED_APP_MESSAGE);

    return config?.value ?? null;
  }

  public async setDisabledAppMessage(message: string): Promise<void> {
    await this.saveLine(KEY_DISABLED_APP_MESSAGE, message);
  }

  public async getCurrentEditionId(): Promise<number | null> {
    const config = await this.getLine(KEY_CURRENT_EDITION_ID);

    return config?.value ? parseInt(config.value) : null;
  }

  public async setCurrentEditionId(editionId: number | null): Promise<void> {
    if (editionId === null) {
      await this.deleteLine(KEY_CURRENT_EDITION_ID);
      return;
    }

    await this.saveLine(KEY_CURRENT_EDITION_ID, editionId.toString());
  }

  private async getLine(key: string): Promise<Config | null> {
    const configs = await this.db.select().from(TABLE_CONFIG).where(eq(TABLE_CONFIG.key, key));

    return this.getUniqueResult(configs);
  }

  /**
   * Updates a line or create it if it doesn't exist
   * @param key The key of the line to save
   * @param value The value to save
   * @returns The created or updated line
   */
  private async saveLine(key: string, value: string): Promise<Config> {
    await this.db.insert(TABLE_CONFIG).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });

    const newLine = await this.getLine(key);

    if (!newLine) {
      throw new Error(`Failed to get updated config data from database (key: ${key})`);
    }

    return newLine;
  }

  /**
   * Deletes a line
   * @param key The key of the line to delete
   * @returns true if the line was found and deleted, false otherwise
   */
  private async deleteLine(key: string): Promise<boolean> {
    const [resultSetHeader] = await this.db.delete(TABLE_CONFIG).where(eq(TABLE_CONFIG.key, key));

    return !!resultSetHeader.affectedRows;
  }
}
