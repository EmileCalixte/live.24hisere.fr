import { Injectable } from "@nestjs/common";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { AdminPassage, AdminPassageWithRunnerIdAndRaceId, PublicPassage } from "@live24hisere/core/types";
import { TABLE_PARTICIPANT, TABLE_PASSAGE, TABLE_RACE, TABLE_RUNNER } from "../../../../drizzle/schema";
import { DrizzleTableColumns } from "../../../types/utils/drizzle";
import { EntityService } from "../entity.service";

@Injectable()
export class PassageService extends EntityService {
  async getPassageById(passageId: number): Promise<AdminPassageWithRunnerIdAndRaceId | null> {
    const passages = await this.db
      .select({
        ...this.getAdminPassageColumns(),
        raceId: TABLE_PARTICIPANT.raceId,
        runnerId: TABLE_PARTICIPANT.runnerId,
      })
      .from(TABLE_PASSAGE)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(eq(TABLE_PASSAGE.id, passageId));

    return this.getUniqueResult(passages);
  }

  async getPassageByDetectionId(detectionId: number): Promise<AdminPassageWithRunnerIdAndRaceId | null> {
    const passages = await this.db
      .select({
        ...this.getAdminPassageColumns(),
        raceId: TABLE_PARTICIPANT.raceId,
        runnerId: TABLE_PARTICIPANT.runnerId,
      })
      .from(TABLE_PASSAGE)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(eq(TABLE_PASSAGE.detectionId, detectionId));

    return this.getUniqueResult(passages);
  }

  async getAllPassages(): Promise<AdminPassageWithRunnerIdAndRaceId[]> {
    return await this.db
      .select({
        ...this.getAdminPassageColumns(),
        raceId: TABLE_PARTICIPANT.raceId,
        runnerId: TABLE_PARTICIPANT.runnerId,
      })
      .from(TABLE_PASSAGE)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .orderBy(asc(TABLE_PASSAGE.time));
  }

  async getAllPublicPassages(): Promise<AdminPassageWithRunnerIdAndRaceId[]> {
    return await this.db
      .select({
        ...this.getAdminPassageColumns(),
        raceId: TABLE_PARTICIPANT.raceId,
        runnerId: TABLE_PARTICIPANT.runnerId,
      })
      .from(TABLE_PASSAGE)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(eq(TABLE_PASSAGE.isHidden, false))
      .orderBy(asc(TABLE_PASSAGE.time));
  }

  async getAdminPassagesByRaceAndRunnerId(raceId: number, runnerId: number): Promise<AdminPassage[]> {
    return await this.db
      .select(this.getAdminPassageColumns())
      .from(TABLE_PASSAGE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(and(eq(TABLE_PARTICIPANT.raceId, raceId), eq(TABLE_PARTICIPANT.runnerId, runnerId)))
      .orderBy(asc(TABLE_PASSAGE.time));
  }

  /** @deprecated */
  async getPublicPassagesByRaceAndRunnerId(raceId: number, runnerId: number): Promise<PublicPassage[]> {
    return await this.db
      .select(this.getPublicPassageColumns())
      .from(TABLE_PASSAGE)
      .leftJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(
        and(
          eq(TABLE_PARTICIPANT.raceId, raceId),
          eq(TABLE_PARTICIPANT.runnerId, runnerId),
          eq(TABLE_PASSAGE.isHidden, false),
        ),
      )
      .orderBy(asc(TABLE_PASSAGE.time));
  }

  /**
   * @returns A map with runner ID as key and list of passages of the runner in the provided race as value
   */
  async getPublicPassagesByRaceId(raceId: number): Promise<Map<number, PublicPassage[]>> {
    const passages = await this.db
      .select({ ...this.getPublicPassageColumns(), runnerId: TABLE_PARTICIPANT.runnerId })
      .from(TABLE_PASSAGE)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(and(eq(TABLE_PARTICIPANT.raceId, raceId), eq(TABLE_PASSAGE.isHidden, false)))
      .orderBy(asc(TABLE_PASSAGE.time));

    return passages.reduce((map, passage) => {
      const runnerPassages = map.get(passage.runnerId) ?? [];

      runnerPassages.push(passage);
      map.set(passage.runnerId, runnerPassages);

      return map;
    }, new Map<number, PublicPassage[]>());
  }

  async createPassage(
    raceId: number,
    runnerId: number,
    passageData: Omit<AdminPassage, "id">,
  ): Promise<AdminPassageWithRunnerIdAndRaceId> {
    const participant = this.getUniqueResult(
      await this.db
        .select()
        .from(TABLE_PARTICIPANT)
        .where(and(eq(TABLE_RACE.id, raceId), eq(TABLE_RUNNER.id, runnerId))),
    );

    if (!participant) {
      throw new Error(
        `Failed to find a participant with provided race and runner IDs (provided race ID: ${raceId}, provided runner ID: ${runnerId})`,
      );
    }

    const result = await this.db
      .insert(TABLE_PASSAGE)
      .values({ ...passageData, participantId: participant.id })
      .$returningId();

    const passageId = this.getUniqueResult(result)?.id;

    if (passageId === undefined) {
      throw new Error("Failed to insert a passage in database (no ID returned)");
    }

    const newPassage = await this.getPassageById(passageId);

    if (!newPassage) {
      throw new Error(`Failed to get created passage data in database (created passage ID: ${passageId}`);
    }

    return newPassage;
  }

  async updatePassage(
    passageId: number,
    newPassageData: Partial<Omit<AdminPassage, "id">>,
  ): Promise<AdminPassageWithRunnerIdAndRaceId> {
    const [resultSetHeader] = await this.db
      .update(TABLE_PASSAGE)
      .set(newPassageData)
      .where(eq(TABLE_PASSAGE.id, passageId));

    if (resultSetHeader.affectedRows === 0) {
      throw new Error(`Passage with ID ${passageId} not found in database`);
    }

    const newPassage = await this.getPassageById(passageId);

    if (!newPassage) {
      throw new Error(`Failed to get updated passage data from database (updated passage ID: ${passageId})`);
    }

    return newPassage;
  }

  /**
   * Deletes a passage
   * @param passageId The ID of the passage to delete
   * @returns true if the passage was found and deleted, false otherwise
   */
  async deletePassage(passageId: number): Promise<boolean> {
    const [resultSetHeader] = await this.db.delete(TABLE_PASSAGE).where(eq(TABLE_PASSAGE.id, passageId));

    return !!resultSetHeader.affectedRows;
  }

  private getPublicPassageColumns(): Pick<DrizzleTableColumns<typeof TABLE_PASSAGE>, "id" | "time"> {
    const { id, time } = getTableColumns(TABLE_PASSAGE);

    return { id, time };
  }

  private getAdminPassageColumns(): Omit<DrizzleTableColumns<typeof TABLE_PASSAGE>, "participantId"> {
    const { participantId, ...columns } = getTableColumns(TABLE_PASSAGE);

    return columns;
  }
}
