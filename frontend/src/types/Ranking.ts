import { type ProcessedPassage } from "./Passage";
import { type RunnerProcessedHour, type RunnerWithPassageCount } from "./Runner";

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

export interface RankingRunner extends RunnerWithPassageCount {
    /**
     * The total distance covered by the runner, in meters
     */
    distance: number;

    /**
     * The average speed of the runner, in km/h. Null if runner has no passage
     */
    averageSpeed: number | null;

    /**
     * The average pace of the runner, in ms/km. Null if runner has no passage
     */
    averagePace: number | null;

    /**
     * The time of the last passage of the runner. Null if runner has no passage
     */
    lastPassageTime: null | {
        /**
         * The race time at the last passage of the runner, in milliseconds
         */
        raceTime: number;

        /**
         * The date and time of the runner's last passage
         */
        time: Date;
    };

    /**
     * The list of the runner's passages with additional data
     */
    passages: ProcessedPassage[];

    /**
     * The ranks of the runner on the rankings scratch, by category and by gender
     */
    ranks: RankingRunnerRanks;

    /**
     * The race hours of the runner
     */
    hours: RunnerProcessedHour[];
}

export type Ranking = RankingRunner[];

/**
 * A map whose keys are race IDs ande values are the corresponding rankings
 */
export type RankingMap = Map<number, Ranking>;
