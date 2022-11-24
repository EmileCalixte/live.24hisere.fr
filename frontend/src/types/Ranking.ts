import Runner from "./Runner";

/**
 * An object representing a runner in a ranking array
 */
export type RankingRunner = Runner & {
    /**
     * The total number of times the runner has passed the timing point
     */
    passageCount: number;

    /**
     * A string representing the last passage time, format `${YYYY}-${MM}-${DD}T{hh}:${ii}:${ss}`
     */
    lastPassageTime: string;
}

type RankingRunnerRanksObject = {
    /**
     * The scratch rank of the runner (regardless of category and gender)
     */
    scratchMixed: number;

    /**
     * The rank of the runner in the ranking of the corresponding gender
     */
    scratchGender: number;

    /**
     * The rank of the runner in the ranking of the corresponding category
     */
    categoryMixed: number;

    /**
     * The rank of the runner in the ranking of the corresponding category and gender
     */
    categoryGender: number;
}

/**
 * An object representing the ranks of the runner on the rankings scratch, by category and by gender
 */
export type RankingRunnerRanks = {
    /**
     * The real, absolute ranks of the runner
     */
    actual: RankingRunnerRanksObject;

    /**
     * The displayed ranks of the runner. They are identical to the real ones, except in case of equality with the
     * previous runner
     */
    displayed: RankingRunnerRanksObject;
}

/**
 * An object representing a runner in ranking array with additionnal data about the runner
 */
export type ProcessedRankingRunner = RankingRunner & {
    /**
     * The total distance covered by the runner
     */
    distance: number;

    /**
     * The race time at the last passage of the runner, in milliseconds. Null if runner has no passage
     */
    lastPassageRaceTime: number | null;

    /**
     * The average speed of the runner, in km/h. Null if runner has no passage
     */
    averageSpeed: number | null;

    /**
     * The ranks of the runner on the rankings scratch, by category and by gender
     */
    rankings: RankingRunnerRanks;
}

export type Ranking = RankingRunner[];

export type ProcessedRanking = ProcessedRankingRunner[];
