import Runner from "./Runner";

export interface RankingRunner extends Runner {
    passageCount: number,
    lastPassageTime: string,
}

export interface RankingRunnerRankings {
    real: {
        scratchMixed: number,
        scratchGender: number,
        categoryMixed: number,
        categoryGender: number,
    },
    displayed: { // Same as real, except in case of equality with the previous runner
        scratchMixed: number,
        scratchGender: number,
        categoryMixed: number,
        categoryGender: number,
    },
}

export interface ProcessedRankingRunner extends RankingRunner {
    distance: number,
    lastPassageRaceTime: number | null,
    averageSpeed: number | null,
    rankings: RankingRunnerRankings,
}

export type Ranking = RankingRunner[];

export type ProcessedRanking = ProcessedRankingRunner[];
