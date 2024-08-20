import { Injectable } from "@nestjs/common";
import { and, asc, count, eq, getTableColumns, max } from "drizzle-orm";
import { objectUtils } from "@live24hisere/utils";
import { TABLE_RACE, TABLE_RUNNER } from "../../../../drizzle/schema";
import { DrizzleTableColumns } from "../../../types/misc/Drizzle";
import {
    AdminRaceWithRunnerCount,
    PublicRaceWithRunnerCount,
    Race,
} from "../../../types/Race";
import { EntityService } from "../entity.service";

@Injectable()
export class RaceService extends EntityService {
    async getRaceById(raceId: number): Promise<Race | null> {
        const races = await this.db
            .select()
            .from(TABLE_RACE)
            .where(eq(TABLE_RACE.id, raceId));

        return this.getUniqueResult(races);
    }

    async getRaceByName(raceName: string): Promise<Race | null> {
        const races = await this.db
            .select()
            .from(TABLE_RACE)
            .where(eq(TABLE_RACE.name, raceName));

        return this.getUniqueResult(races);
    }

    async getAdminRaces(): Promise<AdminRaceWithRunnerCount[]> {
        return await this.db
            .select({
                ...this.getAdminRaceColumns(),
                runnerCount: count(TABLE_RUNNER.id),
            })
            .from(TABLE_RACE)
            .leftJoin(TABLE_RUNNER, eq(TABLE_RUNNER.raceId, TABLE_RACE.id))
            .orderBy(asc(TABLE_RACE.order))
            .groupBy(TABLE_RACE.id);
    }

    async getAdminRaceById(
        raceId: number,
    ): Promise<AdminRaceWithRunnerCount | null> {
        const races = await this.db
            .select({
                ...this.getAdminRaceColumns(),
                runnerCount: count(TABLE_RUNNER.id),
            })
            .from(TABLE_RACE)
            .leftJoin(TABLE_RUNNER, eq(TABLE_RUNNER.raceId, TABLE_RACE.id))
            .groupBy(TABLE_RACE.id)
            .where(eq(TABLE_RACE.id, raceId));

        return this.getUniqueResult(races);
    }

    async getPublicRaces(): Promise<PublicRaceWithRunnerCount[]> {
        return await this.db
            .select({
                ...this.getPublicRaceColumns(),
                runnerCount: count(TABLE_RUNNER.id),
            })
            .from(TABLE_RACE)
            .leftJoin(TABLE_RUNNER, eq(TABLE_RUNNER.raceId, TABLE_RACE.id))
            .orderBy(asc(TABLE_RACE.order))
            .groupBy(TABLE_RACE.id)
            .where(eq(TABLE_RACE.isPublic, true));
    }

    async getPublicRaceById(
        raceId: number,
    ): Promise<PublicRaceWithRunnerCount | null> {
        const races = await this.db
            .select({
                ...this.getPublicRaceColumns(),
                runnerCount: count(TABLE_RUNNER.id),
            })
            .from(TABLE_RACE)
            .leftJoin(TABLE_RUNNER, eq(TABLE_RUNNER.raceId, TABLE_RACE.id))
            .groupBy(TABLE_RACE.id)
            .where(
                and(eq(TABLE_RACE.id, raceId), eq(TABLE_RACE.isPublic, true)),
            );

        return this.getUniqueResult(races);
    }

    async createRace(raceData: Omit<Race, "id">): Promise<Race> {
        const result = await this.db
            .insert(TABLE_RACE)
            .values(raceData)
            .$returningId();

        const raceId = this.getUniqueResult(result)?.id;

        if (raceId === undefined) {
            throw new Error(
                "Failed to insert a race in database (no ID returned)",
            );
        }

        const newRace = await this.getRaceById(raceId);

        if (!newRace) {
            throw new Error(
                `Failed to get created race data in database (created race ID: ${raceId}`,
            );
        }

        return newRace;
    }

    async updateRace(
        raceId: number,
        newRaceData: Partial<Omit<Race, "id">>,
    ): Promise<AdminRaceWithRunnerCount> {
        if (!objectUtils.isEmptyObject(newRaceData)) {
            const [resultSetHeader] = await this.db
                .update(TABLE_RACE)
                .set(newRaceData)
                .where(eq(TABLE_RACE.id, raceId));

            if (resultSetHeader.affectedRows === 0) {
                throw new Error(`Race with ID ${raceId} not found in database`);
            }
        }

        const newRace = await this.getAdminRaceById(raceId);

        if (!newRace) {
            throw new Error(
                `Failed to get updated race data from database (updated race ID: ${raceId})`,
            );
        }

        return newRace;
    }

    /**
     * Deletes a race
     * @param raceId The ID of the race to delete
     * @returns true if the race was found and deleted, false otherwise
     */
    async deleteRace(raceId: number): Promise<boolean> {
        const [resultSetHeader] = await this.db
            .delete(TABLE_RACE)
            .where(eq(TABLE_RACE.id, raceId));

        return !!resultSetHeader.affectedRows;
    }

    async getMaxOrder(): Promise<number> {
        const result = await this.db
            .select({ max: max(TABLE_RACE.order) })
            .from(TABLE_RACE);

        return this.getUniqueResult(result)?.max ?? 0;
    }

    private getPublicRaceColumns(): Omit<
        DrizzleTableColumns<typeof TABLE_RACE>,
        "isPublic" | "order"
    > {
        const { isPublic, order, ...columns } = getTableColumns(TABLE_RACE);

        return columns;
    }

    private getAdminRaceColumns(): Omit<
        DrizzleTableColumns<typeof TABLE_RACE>,
        "order"
    > {
        const { order, ...columns } = getTableColumns(TABLE_RACE);

        return columns;
    }
}
