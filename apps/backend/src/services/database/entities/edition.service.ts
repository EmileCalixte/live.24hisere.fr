import { Injectable } from "@nestjs/common";
import { and, asc, count, countDistinct, eq, getTableColumns, max } from "drizzle-orm";
import {
  AdminEditionWithOrder,
  AdminEditionWithRaceAndRunnerCount,
  AdminEditionWithRaceCount,
  EditionWithRaceCount,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { TABLE_EDITION, TABLE_PARTICIPANT, TABLE_RACE } from "../../../../drizzle/schema";
import { DrizzleTableColumns } from "../../../types/utils/drizzle";
import { EntityService } from "../entity.service";

@Injectable()
export class EditionService extends EntityService {
  async getAdminEditions(): Promise<AdminEditionWithRaceAndRunnerCount[]> {
    return await this.db
      .select({
        ...this.getAdminEditionColumns(),
        raceCount: countDistinct(TABLE_RACE.id),
        runnerCount: countDistinct(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_EDITION)
      .leftJoin(TABLE_RACE, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .orderBy(asc(TABLE_EDITION.order))
      .groupBy(TABLE_EDITION.id);
  }

  async getAdminEditionById(editionId: number): Promise<AdminEditionWithRaceCount | null> {
    const editions = await this.db
      .select({
        ...this.getAdminEditionColumns(),
        raceCount: count(TABLE_RACE.id),
      })
      .from(TABLE_EDITION)
      .leftJoin(TABLE_RACE, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .groupBy(TABLE_EDITION.id)
      .where(eq(TABLE_EDITION.id, editionId));

    return this.getUniqueResult(editions);
  }

  async getAdminEditionByName(editionName: string): Promise<AdminEditionWithRaceCount | null> {
    const editions = await this.db
      .select({
        ...this.getAdminEditionColumns(),
        raceCount: count(TABLE_RACE.id),
      })
      .from(TABLE_EDITION)
      .leftJoin(TABLE_RACE, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .groupBy(TABLE_EDITION.id)
      .where(eq(TABLE_EDITION.name, editionName));

    return this.getUniqueResult(editions);
  }

  async getPublicEditions(): Promise<EditionWithRaceCount[]> {
    return await this.db
      .select({
        ...this.getPublicEditionColumns(),
        raceCount: count(TABLE_RACE.id),
      })
      .from(TABLE_EDITION)
      .leftJoin(TABLE_RACE, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .orderBy(asc(TABLE_EDITION.order))
      .groupBy(TABLE_EDITION.id)
      .where(eq(TABLE_EDITION.isPublic, true));
  }

  async getPublicEditionById(editionId: number): Promise<EditionWithRaceCount | null> {
    const editions = await this.db
      .select({
        ...this.getPublicEditionColumns(),
        raceCount: count(TABLE_RACE.id),
      })
      .from(TABLE_EDITION)
      .leftJoin(TABLE_RACE, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .orderBy(asc(TABLE_EDITION.order))
      .groupBy(TABLE_EDITION.id)
      .where(and(eq(TABLE_EDITION.isPublic, true), eq(TABLE_EDITION.id, editionId)));

    return this.getUniqueResult(editions);
  }

  async createEdition(editionData: Omit<AdminEditionWithOrder, "id">): Promise<AdminEditionWithRaceCount> {
    const result = await this.db.insert(TABLE_EDITION).values(editionData).$returningId();

    const editionId = this.getUniqueResult(result)?.id;

    if (editionId === undefined) {
      throw new Error("Failed to insert an edition in database (no ID returned)");
    }

    const newEdition = await this.getAdminEditionById(editionId);

    if (!newEdition) {
      throw new Error(`Failed to get created edition data in database (created edition ID: ${editionId})`);
    }

    return newEdition;
  }

  async updateEdition(
    editionId: number,
    newEditionData: Partial<Omit<AdminEditionWithOrder, "id">>,
  ): Promise<AdminEditionWithRaceCount> {
    if (!objectUtils.isEmptyObject(newEditionData)) {
      const [resultSetHeader] = await this.db
        .update(TABLE_EDITION)
        .set(newEditionData)
        .where(eq(TABLE_EDITION.id, editionId));

      if (resultSetHeader.affectedRows === 0) {
        throw new Error(`Edition with ID ${editionId} not found in database`);
      }
    }

    const newEdition = await this.getAdminEditionById(editionId);

    if (!newEdition) {
      throw new Error(`Failed to get updated edition data from database (updated edition ID: ${editionId})`);
    }

    return newEdition;
  }

  /**
   * Deletes an edition
   * @param editionId The ID of the edition to delete
   * @returns true if the edition was found and deleted, false otherwise
   */
  async deleteEdition(editionId: number): Promise<boolean> {
    const [resultSetHeader] = await this.db.delete(TABLE_EDITION).where(eq(TABLE_EDITION.id, editionId));

    return !!resultSetHeader.affectedRows;
  }

  async getMaxOrder(): Promise<number> {
    const result = await this.db.select({ max: max(TABLE_EDITION.order) }).from(TABLE_EDITION);

    return this.getUniqueResult(result)?.max ?? 0;
  }

  private getPublicEditionColumns(): Omit<DrizzleTableColumns<typeof TABLE_EDITION>, "isPublic" | "order"> {
    const { isPublic, order, ...columns } = getTableColumns(TABLE_EDITION);

    return columns;
  }

  private getAdminEditionColumns(): Omit<DrizzleTableColumns<typeof TABLE_EDITION>, "order"> {
    const { order, ...columns } = getTableColumns(TABLE_EDITION);

    return columns;
  }
}
