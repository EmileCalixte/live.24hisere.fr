import { Injectable } from "@nestjs/common";
import { and, count, eq, getTableColumns, sql } from "drizzle-orm";
import {
  AdminRunner,
  PublicRunner,
  RaceRunner,
  RaceRunnerWithPassages,
  RunnerWithRaceCount,
} from "@live24hisere/core/types";
import { TABLE_EDITION, TABLE_PARTICIPANT, TABLE_PASSAGE, TABLE_RACE, TABLE_RUNNER } from "../../../../drizzle/schema";
import { DrizzleTableColumns } from "../../../types/utils/drizzle";
import { DrizzleService } from "../drizzle.service";
import { EntityService } from "../entity.service";
import { PassageService } from "./passage.service";

@Injectable()
export class RunnerService extends EntityService {
  constructor(
    drizzleService: DrizzleService,
    private readonly passageService: PassageService,
  ) {
    super(drizzleService);
  }

  async getPublicRunnerById(runnerId: number): Promise<RunnerWithRaceCount | null> {
    const runners = await this.db
      .select({
        ...this.getPublicRunnerColumns(),
        raceCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RUNNER)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id))
      .where(and(eq(TABLE_RUNNER.id, runnerId), eq(TABLE_RUNNER.isPublic, true)));

    return this.getUniqueResult(runners);
  }

  async getAdminRunnerById(runnerId: number): Promise<RunnerWithRaceCount<AdminRunner> | null> {
    const runners = await this.db
      .select({
        ...getTableColumns(TABLE_RUNNER),
        raceCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RUNNER)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id))
      .where(eq(TABLE_RUNNER.id, runnerId));

    return this.getUniqueResult(runners);
  }

  async getAdminRunners(): Promise<Array<RunnerWithRaceCount<AdminRunner>>> {
    return await this.db
      .select({
        ...getTableColumns(TABLE_RUNNER),
        raceCount: count(TABLE_PARTICIPANT.id),
      })
      .from(TABLE_RUNNER)
      .innerJoin(TABLE_PARTICIPANT, eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id))
      .groupBy(TABLE_RUNNER.id);
  }

  // async getAdminRunnerById(runnerId: number): Promise<RaceRunnerWithPassages<RaceRunner, AdminPassage> | null> {
  //   const [runners, passages] = await Promise.all([
  //     this.db.select().from(TABLE_RUNNER).where(eq(TABLE_RUNNER.id, runnerId)),
  //     this.passageService.getAdminPassagesByRunnerId(runnerId),
  //   ]);

  //   const runner = this.getUniqueResult(runners);

  //   if (!runner) {
  //     return null;
  //   }

  //   return {
  //     ...runner,
  //     passages,
  //   };
  // }

  async getPublicRunners(): Promise<PublicRunner[]> {
    return await this.db
      .select(this.getPublicRunnerColumns())
      .from(TABLE_RUNNER)
      .where(eq(TABLE_RUNNER.isPublic, true));
  }

  async getPublicRunnersOfEdition(editionId: number): Promise<RaceRunner[]> {
    return await this.db
      .select({
        ...this.getPublicRunnerColumns(),
        ...this.getPublicParticipantColumns(),
      })
      .from(TABLE_PARTICIPANT)
      .innerJoin(TABLE_RUNNER, eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id))
      .innerJoin(TABLE_RACE, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_EDITION, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .where(
        and(
          eq(TABLE_EDITION.id, editionId),
          eq(TABLE_RUNNER.isPublic, true),
          eq(TABLE_RACE.isPublic, true),
          eq(TABLE_EDITION.isPublic, true),
        ),
      );
  }

  async getPublicRunnersOfRace(raceId: number): Promise<RaceRunnerWithPassages[]> {
    const runners = await this.db
      .select({
        ...this.getPublicRunnerColumns(),
        ...this.getPublicParticipantColumns(),
      })
      .from(TABLE_PARTICIPANT)
      .innerJoin(TABLE_RUNNER, eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id))
      .innerJoin(TABLE_RACE, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_EDITION, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .where(
        and(
          eq(TABLE_RACE.id, raceId),
          eq(TABLE_RUNNER.isPublic, true),
          eq(TABLE_RACE.isPublic, true),
          eq(TABLE_EDITION.isPublic, true),
        ),
      );

    const runnerPassages = await this.passageService.getPublicPassagesByRaceId(raceId);

    return runners.map((runner) => ({
      ...runner,
      passages: runnerPassages.get(runner.id) ?? [],
    }));
  }

  public async getAdminRaceRunners(raceId: number): Promise<Array<RaceRunner<AdminRunner>>> {
    return await this.db
      .select({
        ...getTableColumns(TABLE_RUNNER),
        ...this.getPublicParticipantColumns(),
      })
      .from(TABLE_PARTICIPANT)
      .innerJoin(TABLE_RUNNER, eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id))
      .innerJoin(TABLE_RACE, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_EDITION, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .where(eq(TABLE_RACE.id, raceId));
  }

  private async getRaceRunner(raceId: number, runnerId: number, publicOnly: boolean): Promise<RaceRunner | null> {
    const where = [eq(TABLE_RACE.id, raceId), eq(TABLE_RUNNER.id, runnerId)];

    if (publicOnly) {
      where.push(eq(TABLE_RUNNER.isPublic, true), eq(TABLE_RACE.isPublic, true), eq(TABLE_EDITION.isPublic, true));
    }

    const runners = await this.db
      .select({
        ...this.getPublicRunnerColumns(),
        ...this.getPublicParticipantColumns(),
      })
      .from(TABLE_PARTICIPANT)
      .innerJoin(TABLE_RUNNER, eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id))
      .innerJoin(TABLE_RACE, eq(TABLE_PARTICIPANT.raceId, TABLE_RACE.id))
      .innerJoin(TABLE_EDITION, eq(TABLE_RACE.editionId, TABLE_EDITION.id))
      .where(and(...where));

    return this.getUniqueResult(runners);
  }

  // async getPublicRaceRunner(raceId: number, runnerId: number): Promise<RaceRunner | null> {
  //   const runner = this.getRaceRunner(raceId, runnerId, true);
  // }

  // async addRunnerToRace(participantData: Omit<Participant, "id">): Promise<RaceRunner> {
  //   await this.db.insert(TABLE_PARTICIPANT).values(participantData);
  // }

  async createRunner(runnerData: Omit<AdminRunner, "id">): Promise<RunnerWithRaceCount<AdminRunner>> {
    const result = await this.db.insert(TABLE_RUNNER).values(runnerData).$returningId();

    const runnerId = this.getUniqueResult(result)?.id;

    if (runnerId === undefined) {
      throw new Error("Failed to insert a runner in database (no ID returned)");
    }

    const newRunner = await this.getAdminRunnerById(runnerId);

    if (!newRunner) {
      throw new Error(`Failed to get created runner data in database (created runner ID: ${runnerId}`);
    }

    return newRunner;
  }

  /**
   * Batch insert runners
   * @param data The runners
   * @returns The number of created rows
   */
  // async createRunners(data: RaceRunner[]): Promise<number> {
  //   const [resultSetHeader] = await this.db.insert(TABLE_RUNNER).values(data);

  //   return resultSetHeader.affectedRows;
  // }

  async updateRunner(
    runnerId: number,
    newRunnerData: Partial<Omit<AdminRunner, "id">>,
  ): Promise<RunnerWithRaceCount<AdminRunner>> {
    const [resultSetHeader] = await this.db
      .update(TABLE_RUNNER)
      .set(newRunnerData)
      .where(eq(TABLE_RUNNER.id, runnerId));

    if (resultSetHeader.affectedRows === 0) {
      throw new Error(`Runner with ID ${runnerId} not found in database`);
    }

    const newRunner = await this.getAdminRunnerById(runnerId);

    if (!newRunner) {
      throw new Error(`Failed to get updated runner data from database (updated runner ID: ${runnerId})`);
    }

    return newRunner;
  }

  /**
   * Deletes a runner and all his passages and participations
   * @param runnerId The ID of the runner to delete
   * @returns true if runner was deleted, false otherwise (e.q. if no runner matches the provided ID)
   */
  async deleteRunner(runnerId: number): Promise<boolean> {
    return await this.db.transaction(async (tx) => {
      // Drizzle does not support joins on delete statements yet, so we have to execute a raw SQL DELETE query
      await tx.execute(
        sql`
          DELETE ${TABLE_PASSAGE}
          FROM ${TABLE_PASSAGE}
          INNER JOIN ${TABLE_PARTICIPANT} ON ${TABLE_PARTICIPANT.id} = ${TABLE_PASSAGE.participantId}
          WHERE ${TABLE_PARTICIPANT.runnerId} = ${runnerId}
        `,
      );

      await tx.delete(TABLE_PARTICIPANT).where(eq(TABLE_PARTICIPANT.runnerId, TABLE_RUNNER.id));

      const [resultSetHeader] = await tx.delete(TABLE_RUNNER).where(eq(TABLE_RUNNER.id, runnerId));

      return !!resultSetHeader.affectedRows;
    });
  }

  private getPublicRunnerColumns(): Omit<DrizzleTableColumns<typeof TABLE_RUNNER>, "isPublic"> {
    const { isPublic, ...columns } = getTableColumns(TABLE_RUNNER);

    return columns;
  }

  private getPublicParticipantColumns(): Omit<DrizzleTableColumns<typeof TABLE_PARTICIPANT>, "id" | "runnerId"> {
    const { id, runnerId, ...columns } = getTableColumns(TABLE_PARTICIPANT);

    return columns;
  }
}
