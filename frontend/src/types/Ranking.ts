import Runner from "./Runner";

interface RankingRunner extends Runner {
    passageCount: number,
    lastPassageTime: string,
}

interface ProcessedRankingRunner extends RankingRunner {
    distance: number,
    lastPassageRaceTime: number,
    averageSpeed: number,
    rankings: {
        real: {
            scratchMixed: number,
            scratchGender: number,
            categoryMixed: number,
            categoryGender: number,
        },
        displayed: {
            scratchMixed: number,
            scratchGender: number,
            categoryMixed: number,
            categoryGender: number,
        }
    }
}

export type Ranking = RankingRunner[];

export type ProcessedRanking = ProcessedRankingRunner[];
