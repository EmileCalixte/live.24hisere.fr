import { Injectable } from "@nestjs/common";
import { and, eq, getTableColumns } from "drizzle-orm";
import { TABLE_PASSAGE } from "drizzle/schema";
import { DrizzleTableColumns } from "src/types/misc/Drizzle";
import {
    AdminPassageOfRunner,
    Passage,
    PublicPassageOfRunner,
} from "src/types/Passage";
import { fixDrizzleDates } from "src/utils/drizzle.utils";
import { EntityService } from "../entity.service";

@Injectable()
export class PassageService extends EntityService {
    async getPassageById(passageId: number): Promise<Passage | null> {
        const passages = await this.db
            .select()
            .from(TABLE_PASSAGE)
            .where(eq(TABLE_PASSAGE.id, passageId));

        const passage = this.getUniqueResult(passages);

        return passage ? fixDrizzleDates(passage) : null;
    }

    async getPassageByDetectionId(
        detectionId: number,
    ): Promise<Passage | null> {
        const passages = await this.db
            .select()
            .from(TABLE_PASSAGE)
            .where(eq(TABLE_PASSAGE.detectionId, detectionId));

        const passage = this.getUniqueResult(passages);

        return passage ? fixDrizzleDates(passage) : null;
    }

    async getAllPassages(): Promise<Passage[]> {
        const passages = await this.db.query.TABLE_PASSAGE.findMany();

        return fixDrizzleDates(passages);
    }

    async getAllPublicPassages(): Promise<Passage[]> {
        const passages = await this.db
            .select()
            .from(TABLE_PASSAGE)
            .where(eq(TABLE_PASSAGE.isHidden, false));

        return fixDrizzleDates(passages);
    }

    async getAdminPassagesByRunnerId(
        runnerId: number,
    ): Promise<AdminPassageOfRunner[]> {
        const passages = await this.db
            .select(this.getAdminPassageColumns())
            .from(TABLE_PASSAGE)
            .where(eq(TABLE_PASSAGE.runnerId, runnerId));

        return fixDrizzleDates(passages);
    }

    async getPublicPassagesByRunnerId(
        runnerId: number,
    ): Promise<PublicPassageOfRunner[]> {
        const passages = await this.db
            .select(this.getPublicPassageColumns())
            .from(TABLE_PASSAGE)
            .where(
                and(
                    eq(TABLE_PASSAGE.runnerId, runnerId),
                    eq(TABLE_PASSAGE.isHidden, false),
                ),
            );

        return fixDrizzleDates(passages);
    }

    async createPassage(passageData: Omit<Passage, "id">): Promise<Passage> {
        const result = await this.db
            .insert(TABLE_PASSAGE)
            // @ts-ignore Wrong date type (Drizzle bug)
            .values(passageData)
            .$returningId();

        const passageId = this.getUniqueResult(result)?.id;

        if (passageId === undefined) {
            throw new Error(
                "Failed to insert a passage in database (no ID returned)",
            );
        }

        const newPassage = await this.getPassageById(passageId);

        if (!newPassage) {
            throw new Error(
                `Failed to get created passage data in database (created passage ID: ${passageId}`,
            );
        }

        return newPassage;
    }

    async updatePassage(
        passageId: number,
        newPassageData: Partial<Omit<Passage, "id">>,
    ): Promise<Passage> {
        const [resultSetHeader] = await this.db
            .update(TABLE_PASSAGE)
            // @ts-ignore Wrong date type (Drizzle bug)
            .set(newPassageData)
            .where(eq(TABLE_PASSAGE.id, passageId));

        if (resultSetHeader.affectedRows === 0) {
            throw new Error(
                `Passage with ID ${passageId} not found in database`,
            );
        }

        const newPassage = await this.getPassageById(passageId);

        if (!newPassage) {
            throw new Error(
                `Failed to get updated passage data from database (updated passage ID: ${passageId})`,
            );
        }

        return newPassage;
    }

    /**
     * Deletes a passage
     * @param passageId The ID of the passage to delete
     * @returns true if the passage was found and deleted, false otherwise
     */
    async deletePassage(passageId: number): Promise<boolean> {
        const [resultSetHeader] = await this.db
            .delete(TABLE_PASSAGE)
            .where(eq(TABLE_PASSAGE.id, passageId));

        return !!resultSetHeader.affectedRows;
    }

    private getPublicPassageColumns(): Pick<
        DrizzleTableColumns<typeof TABLE_PASSAGE>,
        "id" | "time"
    > {
        const { id, time } = getTableColumns(TABLE_PASSAGE);

        return { id, time };
    }

    private getAdminPassageColumns(): Omit<
        DrizzleTableColumns<typeof TABLE_PASSAGE>,
        "runnerId"
    > {
        const { runnerId, ...columns } = getTableColumns(TABLE_PASSAGE);

        return columns;
    }
}
