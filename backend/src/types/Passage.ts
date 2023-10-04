import { type Passage } from "@prisma/client";

/**
 * Public data of a passage
 */
export type PublicPassage = Pick<Passage, "id" | "time">;

export interface PublicPassageWithRunerId extends PublicPassage {
    runnerId: number;
}

/**
 * Admin data of a runner's passage
 */
export type AdminRunnerPassage = Omit<Passage, "runnerId">;
