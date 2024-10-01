import { DateISOString } from "./Date";

export interface Passage {
    id: number;
    detectionId: number | null;
    importTime: DateISOString | null;
    runnerId: number;
    time: DateISOString;
    isHidden: boolean;
}

/**
 * Public data of a passage
 */
export type PublicPassageOfRunner = Pick<Passage, "id" | "time">;

/**
 * Admin data of a runner's passage
 */
export type AdminPassageOfRunner = Omit<Passage, "runnerId">;
