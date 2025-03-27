import { Injectable } from "@nestjs/common";
import { and, asc, count, eq, getTableColumns, max, sql } from "drizzle-orm";
import { AdminRace, AdminRaceWithOrder, AdminRaceWithRunnerCount, RaceWithRunnerCount } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import {
  TABLE_EDITION,
  TABLE_PARTICIPANT,
  TABLE_PASSAGE_IMPORT_RULE_RACE,
  TABLE_RACE,
  TABLE_RUNNER,
} from "../../../../drizzle/schema";
import { DrizzleTableColumns } from "../../../types/utils/drizzle";
import { EntityService } from "../entity.service";

@Injectable()
export class RaceService extends EntityService {
  async getAdminRaces(): Promise<AdminRaceWithRunnerCount[]> {
    return await this.db
      .select({
        ...this.getAdminRaceColumns(),
        runnerCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RACE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_EDITION, eq(TABLE_EDITION.id, TABLE_RACE.editionId))
      .orderBy(asc(TABLE_EDITION.order), asc(TABLE_RACE.order))
      .groupBy(TABLE_RACE.id);
  }

  async getEditionAdminRaces(editionId: number): Promise<AdminRaceWithRunnerCount[]> {
    return await this.db
      .select({
        ...this.getAdminRaceColumns(),
        runnerCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RACE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .orderBy(asc(TABLE_RACE.order))
      .groupBy(TABLE_RACE.id)
      .where(eq(TABLE_RACE.editionId, editionId));
  }

  async getPassageImportRuleAdminRaces(ruleId: number): Promise<AdminRace[]> {
    return await this.db
      .select({ ...this.getAdminRaceColumns() })
      .from(TABLE_RACE)
      .innerJoin(TABLE_PASSAGE_IMPORT_RULE_RACE, eq(TABLE_PASSAGE_IMPORT_RULE_RACE.raceId, TABLE_RACE.id))
      .where(eq(TABLE_PASSAGE_IMPORT_RULE_RACE.ruleId, ruleId));
  }

  async getAdminRaceById(raceId: number): Promise<AdminRaceWithRunnerCount | null> {
    const races = await this.db
      .select({
        ...this.getAdminRaceColumns(),
        runnerCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RACE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .groupBy(TABLE_RACE.id)
      .where(eq(TABLE_RACE.id, raceId));

    return this.getUniqueResult(races);
  }

  async getAdminRaceByNameAndEditionId(raceName: string, editionId: number): Promise<AdminRaceWithRunnerCount | null> {
    const races = await this.db
      .select({
        ...this.getAdminRaceColumns(),
        runnerCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RACE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .groupBy(TABLE_RACE.id)
      .where(and(eq(TABLE_RACE.name, raceName), eq(TABLE_RACE.editionId, editionId)));

    return this.getUniqueResult(races);
  }

  async getPublicRaces(): Promise<RaceWithRunnerCount[]> {
    return await this.db
      .select({
        ...this.getPublicRaceColumns(),
        runnerCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RACE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_EDITION, eq(TABLE_EDITION.id, TABLE_RACE.editionId))
      .orderBy(asc(TABLE_EDITION.order), asc(TABLE_RACE.order))
      .groupBy(TABLE_RACE.id)
      .where(and(eq(TABLE_RACE.isPublic, true), eq(TABLE_EDITION.isPublic, true)));
  }

  async getPublicEditionRaces(editionId: number): Promise<RaceWithRunnerCount[]> {
    return await this.db
      .select({
        ...this.getPublicRaceColumns(),
        runnerCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RACE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_EDITION, eq(TABLE_EDITION.id, TABLE_RACE.editionId))
      .orderBy(asc(TABLE_RACE.order))
      .groupBy(TABLE_RACE.id)
      .where(and(eq(TABLE_RACE.isPublic, true), eq(TABLE_EDITION.isPublic, true), eq(TABLE_RACE.editionId, editionId)));
  }

  async getPublicRaceById(raceId: number): Promise<RaceWithRunnerCount | null> {
    const races = await this.db
      .select({
        ...this.getPublicRaceColumns(),
        runnerCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RACE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_RUNNER, eq(TABLE_RUNNER.id, TABLE_PARTICIPANT.runnerId))
      .innerJoin(TABLE_EDITION, eq(TABLE_EDITION.id, TABLE_RACE.editionId))
      .where(
        and(
          eq(TABLE_RACE.id, raceId),
          eq(TABLE_EDITION.isPublic, true),
          eq(TABLE_RACE.isPublic, true),
          eq(TABLE_RUNNER.isPublic, true),
        ),
      );

    return this.getUniqueResult(races);
  }

  async createRace(raceData: Omit<AdminRaceWithOrder, "id">): Promise<AdminRaceWithRunnerCount> {
    const result = await this.db.insert(TABLE_RACE).values(raceData).$returningId();

    const raceId = this.getUniqueResult(result)?.id;

    if (raceId === undefined) {
      throw new Error("Failed to insert a race in database (no ID returned)");
    }

    const newRace = await this.getAdminRaceById(raceId);

    if (!newRace) {
      throw new Error(`Failed to get created race data in database (created race ID: ${raceId})`);
    }

    return newRace;
  }

  async updateRace(
    raceId: number,
    newRaceData: Partial<Omit<AdminRaceWithOrder, "id">>,
  ): Promise<AdminRaceWithRunnerCount> {
    if (!objectUtils.isEmptyObject(newRaceData)) {
      const [resultSetHeader] = await this.db.update(TABLE_RACE).set(newRaceData).where(eq(TABLE_RACE.id, raceId));

      if (resultSetHeader.affectedRows === 0) {
        throw new Error(`Race with ID ${raceId} not found in database`);
      }
    }

    const newRace = await this.getAdminRaceById(raceId);

    if (!newRace) {
      throw new Error(`Failed to get updated race data from database (updated race ID: ${raceId})`);
    }

    return newRace;
  }

  /**
   * Deletes a race
   * @param raceId The ID of the race to delete
   * @returns true if the race was found and deleted, false otherwise
   */
  async deleteRace(raceId: number): Promise<boolean> {
    const [resultSetHeader] = await this.db.delete(TABLE_RACE).where(eq(TABLE_RACE.id, raceId));

    return !!resultSetHeader.affectedRows;
  }

  async getMaxOrder(): Promise<number> {
    const result = await this.db.select({ max: max(TABLE_RACE.order) }).from(TABLE_RACE);

    return this.getUniqueResult(result)?.max ?? 0;
  }

  /**
   * Returns true if all provided IDs correspond to an existing race, false if at least one does not exist
   */
  async doAllRacesExist(raceIds: number[]): Promise<boolean> {
    if (raceIds.length < 1) {
      return true;
    }

    const uniqueRaceIds = Array.from(new Set(raceIds));

    const result = await this.db
      .select({
        count: count(TABLE_RACE.id),
      })
      .from(TABLE_RACE)
      .where(sql`${TABLE_RACE.id} IN ${uniqueRaceIds}`);

    const { count: raceCount } = this.getUniqueResult(result) ?? { count: 0 };

    return raceCount === uniqueRaceIds.length;
  }

  private getPublicRaceColumns(): Omit<DrizzleTableColumns<typeof TABLE_RACE>, "isPublic" | "order"> {
    const { isPublic, order, ...columns } = getTableColumns(TABLE_RACE);

    return columns;
  }

  private getAdminRaceColumns(): Omit<DrizzleTableColumns<typeof TABLE_RACE>, "order"> {
    const { order, ...columns } = getTableColumns(TABLE_RACE);

    return columns;
  }
}
