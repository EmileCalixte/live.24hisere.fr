import {Passage} from "@prisma/client";

export type PublicPassage = Pick<Passage, "id" | "time">;
