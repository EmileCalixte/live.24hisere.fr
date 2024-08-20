import { Injectable } from "@nestjs/common";
import { eq, getTableColumns } from "drizzle-orm";
import { objectUtils } from "@live24hisere/utils";
import {
    TABLE_PASSAGE,
    TABLE_RACE,
    TABLE_RUNNER,
} from "../../../../drizzle/schema";
import {
    AdminRunnerWithPassages,
    PublicRunnerWithPassages,
    Runner,
} from "../../../types/Runner";
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

    async getRunnerById(runnerId: number): Promise<Runner | null> {
        const runners = await this.db
            .select()
            .from(TABLE_RUNNER)
            .where(eq(TABLE_RUNNER.id, runnerId));

        return this.getUniqueResult(runners);
    }

    async getAdminRunners(): Promise<Runner[]> {
        return await this.db.query.TABLE_RUNNER.findMany();
    }

    async getAdminRunnerById(
        runnerId: number,
    ): Promise<AdminRunnerWithPassages | null> {
        const [runners, passages] = await Promise.all([
            this.db
                .select()
                .from(TABLE_RUNNER)
                .where(eq(TABLE_RUNNER.id, runnerId)),
            this.passageService.getAdminPassagesByRunnerId(runnerId),
        ]);

        const runner = this.getUniqueResult(runners);

        if (!runner) {
            return null;
        }

        return {
            ...runner,
            passages,
        };
    }

    async getPublicRunners(): Promise<Runner[]> {
        return await this.db
            .select({ ...getTableColumns(TABLE_RUNNER) })
            .from(TABLE_RUNNER)
            .leftJoin(TABLE_RACE, eq(TABLE_RACE.id, TABLE_RUNNER.raceId))
            .where(eq(TABLE_RACE.isPublic, true));
    }

    async getPublicRunnersOfRace(
        raceId: number,
    ): Promise<PublicRunnerWithPassages[]> {
        const runners = await this.db
            .select({ ...getTableColumns(TABLE_RUNNER) })
            .from(TABLE_RUNNER)
            .where(eq(TABLE_RUNNER.raceId, raceId));

        const runnerPassages = await Promise.all(
            runners.map(
                async (runner) =>
                    await this.passageService.getPublicPassagesByRunnerId(
                        runner.id,
                    ),
            ),
        );

        return runners.map((runner, index) => ({
            ...runner,
            passages: runnerPassages[index],
        }));
    }

    async createRunner(runnerData: Runner): Promise<Runner> {
        await this.db.insert(TABLE_RUNNER).values(runnerData).$returningId();

        const newRunner = await this.getRunnerById(runnerData.id);

        if (!newRunner) {
            throw new Error(
                `Failed to get created runner data in database (created runner ID: ${runnerData.id}`,
            );
        }

        return newRunner;
    }

    /**
     * Batch insert runners
     * @param data The runners
     * @returns The number of created rows
     */
    async createRunners(data: Runner[]): Promise<number> {
        const [resultSetHeader] = await this.db
            .insert(TABLE_RUNNER)
            .values(data);

        return resultSetHeader.affectedRows;
    }

    async updateRunner(
        runnerId: number,
        newRunnerData: Partial<Runner>,
    ): Promise<Runner> {
        // If runner ID is not changed, we can directly update the runner
        if (!newRunnerData.id || newRunnerData.id === runnerId) {
            const [resultSetHeader] = await this.db
                .update(TABLE_RUNNER)
                .set(newRunnerData)
                .where(eq(TABLE_RUNNER.id, runnerId));

            if (resultSetHeader.affectedRows === 0) {
                throw new Error(
                    `Runner with ID ${runnerId} not found in database`,
                );
            }

            const newRunner = await this.getRunnerById(runnerId);

            if (!newRunner) {
                throw new Error(
                    `Failed to get updated runner data from database (updated runner ID: ${runnerId})`,
                );
            }

            return newRunner;
        }

        // Else, we can't directly update the runner because we have to change runnerId of all runner's passages
        const runner = await this.getRunnerById(runnerId);

        if (!runner) {
            throw new Error(`Runner with ID ${runnerId} not found in database`);
        }

        return await this.db.transaction(async (tx) => {
            // So first we create a new runner
            const dataToInsert = objectUtils.assignDefined(
                runner,
                newRunnerData,
            );

            await tx.insert(TABLE_RUNNER).values(dataToInsert);

            const newRunner = this.getUniqueResult(
                await tx
                    .select()
                    .from(TABLE_RUNNER)
                    .where(eq(TABLE_RUNNER.id, dataToInsert.id)),
            );

            if (!newRunner) {
                throw new Error(
                    `Failed to get newly created runner data from database (new runner ID: ${dataToInsert.id})`,
                );
            }

            // Then we change passage runnerIds
            await tx
                .update(TABLE_PASSAGE)
                .set({ runnerId: newRunner.id })
                .where(eq(TABLE_PASSAGE.runnerId, runnerId));

            // Finally we delete the old runner
            await tx.delete(TABLE_RUNNER).where(eq(TABLE_RUNNER.id, runnerId));

            return newRunner;
        });
    }

    async deleteRunner(runnerId: number): Promise<boolean> {
        return await this.db.transaction(async (tx) => {
            await this.db
                .delete(TABLE_PASSAGE)
                .where(eq(TABLE_PASSAGE.runnerId, runnerId));

            const [resultSetHeader] = await this.db
                .delete(TABLE_RUNNER)
                .where(eq(TABLE_RUNNER.id, runnerId));

            return !!resultSetHeader.affectedRows;
        });
    }
}
