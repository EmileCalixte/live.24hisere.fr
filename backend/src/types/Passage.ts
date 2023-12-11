import { type Passage } from "@prisma/client";

/**
 * Public data of a passage
 */
export type PublicPassage = Pick<Passage, "id" | "time">;

/**
 * Admin data of a runner's passage
 */
export type AdminRunnerPassage = Omit<Passage, "runnerId">;
