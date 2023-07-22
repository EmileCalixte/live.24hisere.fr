import { type Passage } from "@prisma/client";

/**
 * Public data of a passage
 */
export type PublicPassage = Pick<Passage, "id" | "time">;
