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
     * The last passage time
     */
    lastPassageTime: Date;
}

/**
 * An array of runners sorted by number of passages, constituting a ranking
 */
export type Ranking = RankingRunner[];
