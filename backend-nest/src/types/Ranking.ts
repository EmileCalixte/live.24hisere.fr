import { type Runner } from "@prisma/client";

/**
 * An object representing a runner in a ranking array
 */
export interface RankingRunner extends Runner {
    /**
     * The total number of times the runner has passed the timing point
     */
    passageCount: number;

    /**
     * The last passage time`
     */
    lastPassageTime: Date;
}

export type Ranking = RankingRunner[];
