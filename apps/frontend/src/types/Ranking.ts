import {
    type RunnerWithProcessedData,
    type RunnerWithProcessedPassages,
} from "@live24hisere/types";

export type RankingType =
    | "scratchMixed"
    | "scratchGender"
    | "categoryMixed"
    | "categoryGender";

export interface RankingRunnerRanksObject {
    /**
     * The scratch rank of the runner in the general ranking
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
export interface RankingRunnerRanks {
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

export interface RankingRunnerGap {
    /**
     * The delay time of the runner's last lap compared to the same lap of the compared runner, in milliseconds
     */
    time: number;

    /**
     * The number of laps behind the compared runner
     */
    laps: number;
}

export interface RankingRunnerGapData<T extends MinimalRankingRunnerInput> {
    /**
     * The runner compared runner
     */
    runner: RankingRunner<T> | null;

    /**
     * The gap between the two runners. Null if the compared runner has no passage
     */
    gap: RankingRunnerGap | null;
}

export interface RankingRunnerGapsObject<T extends MinimalRankingRunnerInput> {
    /**
     * Gaps in the general ranking
     */
    scratchMixed: RankingRunnerGapData<T>;

    /**
     * Gaps in the ranking of the corresponding gender
     */
    scratchGender: RankingRunnerGapData<T>;

    /**
     * Gaps in the ranking of the corresponding category
     */
    categoryMixed: RankingRunnerGapData<T>;

    /**
     * Gaps in the ranking of the corresponding category and gender
     */
    categoryGender: RankingRunnerGapData<T>;
}

export interface RankingRunnerGaps<T extends MinimalRankingRunnerInput> {
    /**
     * The gaps between the runner and the first runner of each ranking
     */
    firstRunner: RankingRunnerGapsObject<T>;

    /**
     * The gap between the runner and the previous runner of each ranking
     */
    previousRunner: RankingRunnerGapsObject<T>;
}

export type RankingRunner<
    T extends MinimalRankingRunnerInput = MinimalRankingRunnerInput,
> = T & {
    /**
     * The ranks of the runner on the rankings scratch, by category and by gender
     */
    ranks: RankingRunnerRanks;

    /**
     * The gaps between the runner and the first one in the rankings scratch, by category and by gender
     */
    gaps: RankingRunnerGaps<T>;
};

export type MinimalRankingRunnerInput = RunnerWithProcessedPassages &
    RunnerWithProcessedData;

export type Ranking<
    T extends MinimalRankingRunnerInput = MinimalRankingRunnerInput,
> = Array<RankingRunner<T>>;
