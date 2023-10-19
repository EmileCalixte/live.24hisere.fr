import { type ProcessedPassage } from "./Passage";
import {
    Runner,
    type RunnerProcessedData,
    type RunnerProcessedHour,
    type RunnerWithPassageCount, RunnerWithPassages, RunnerWithProcessedData,
} from "./Runner";

export interface RankingRunnerRanksObject {
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

export type RankingRunner<T extends MinimalRankingRunnerInput = MinimalRankingRunnerInput> = T & {
    /**
     * The ranks of the runner on the rankings scratch, by category and by gender
     */
    ranks: RankingRunnerRanks;
};

export type MinimalRankingRunnerInput = RunnerWithPassages & RunnerWithProcessedData;

export type Ranking<T extends MinimalRankingRunnerInput = MinimalRankingRunnerInput> = Array<RankingRunner<T>>;

/**
 * A map whose keys are race IDs ande values are the corresponding rankings
 */
export type RankingMap<T extends MinimalRankingRunnerInput> = Map<number, Ranking<T>>;
