import { Injectable } from "@nestjs/common";
import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
import {
  AdminPassage,
  AdminPassageWithRunnerIdAndRaceId,
  PassageImportRule,
  PublicPassage,
} from "@live24hisere/core/types";
import { dateUtils } from "@live24hisere/utils";
import { TABLE_PARTICIPANT, TABLE_PASSAGE } from "../../../../drizzle/schema";
import { DagFileLineData } from "../../../types/Dag";
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

  async getAllPassagesOfRace(raceId: number): Promise<AdminPassageWithRunnerIdAndRaceId[]> {
    return await this.db
      .select({
        ...this.getAdminPassageColumns(),
        raceId: TABLE_PARTICIPANT.raceId,
        runnerId: TABLE_PARTICIPANT.runnerId,
      })
      .from(TABLE_PASSAGE)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(eq(TABLE_PARTICIPANT.raceId, raceId))
      .orderBy(asc(TABLE_PASSAGE.time));
  }

  async getAdminPassagesByRaceAndRunnerId(raceId: number, runnerId: number): Promise<AdminPassage[]> {
    return await this.db
      .select(this.getAdminPassageColumns())
      .from(TABLE_PASSAGE)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.id, TABLE_PASSAGE.participantId))
      .where(and(eq(TABLE_PARTICIPANT.raceId, raceId), eq(TABLE_PARTICIPANT.runnerId, runnerId)))
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
    participantId: number,
    passageData: Omit<AdminPassage, "id">,
  ): Promise<AdminPassageWithRunnerIdAndRaceId> {
    const result = await this.db
      .insert(TABLE_PASSAGE)
      .values({ ...passageData, participantId })
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

  /**
   * @returns The number of imported passages
   */
  async importDagDetections(
    dagDetections: DagFileLineData[],
    raceIds: number[],
    passageImportRule: PassageImportRule,
    importTime: Date,
  ): Promise<number> {
    if (dagDetections.length < 1) {
      return 0;
    }

    const sqlImportTime = dateUtils.formatDateForSql(importTime);

    const statement = sql`
      INSERT INTO passage (detection_id, import_time, import_rule_id, participant_id, time, is_hidden)
      SELECT DISTINCT
        d.detection_id AS detection_id,
        ${sqlImportTime} AS import_time,
        ${passageImportRule.id} As import_rule_id,
        p.id AS participant_id,
        d.time AS time,
        '0' as is_hidden
      FROM (
        ${sql.raw(
          dagDetections
            .map(
              (dagDetection) =>
                `(SELECT
                ${dagDetection.detectionId} AS detection_id,
                ${dagDetection.bibNumber} AS bib_number,
                '${dateUtils.formatDateForSql(dagDetection.passageDateTime)}' AS time
              )`,
            )
            .join(" UNION ALL "),
        )}
      ) AS d
      JOIN participant p ON p.bib_number = d.bib_number
      WHERE p.race_id IN (${sql.raw(raceIds.join(", "))})
      AND NOT EXISTS (
        SELECT 1
        FROM passage pa
        WHERE pa.detection_id = d.detection_id
        AND pa.participant_id = p.id
      );
    `;

    const [resultSetHeader] = await this.db.execute(statement);

    return resultSetHeader.affectedRows;
  }

  /**
   * @returns The number of imported passages
   */
  async importDetections(
    raceId: number,
    detections: Array<{ bib: number; time: Date }>,
    importTime: Date,
  ): Promise<number> {
    if (detections.length < 1) {
      return 0;
    }

    const sqlImportTime = dateUtils.formatDateForSql(importTime);

    const statement = sql`
      INSERT INTO passage (import_time, participant_id, time, is_hidden)
      SELECT DISTINCT
        ${sqlImportTime} AS import_time,
        p.id AS participant_id,
        d.time AS time,
        '0' as is_hidden
      FROM (
        ${sql.raw(
          detections
            .map(
              (detection) =>
                `(SELECT
                ${detection.bib} AS bib_number,
                '${dateUtils.formatDateForSql(detection.time)}' AS time
              )`,
            )
            .join(" UNION ALL "),
        )}
      ) AS d
      JOIN participant p ON p.bib_number = d.bib_number
      WHERE p.race_id = ${raceId}
    `;

    const [resultSetHeader] = await this.db.execute(statement);

    return resultSetHeader.affectedRows;
  }

  private getPublicPassageColumns(): Pick<DrizzleTableColumns<typeof TABLE_PASSAGE>, "id" | "time"> {
    const { id, time } = getTableColumns(TABLE_PASSAGE);

    return { id, time };
  }

  private getAdminPassageColumns(): Omit<DrizzleTableColumns<typeof TABLE_PASSAGE>, "participantId" | "importRuleId"> {
    const { participantId, importRuleId, ...columns } = getTableColumns(TABLE_PASSAGE);

    return columns;
  }
}
