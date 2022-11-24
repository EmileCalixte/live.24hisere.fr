import Passage, {ProcessedPassage} from "./Passage";

export enum Gender {
    M = "M",
    F = "F",
}

export type GenderWithMixed = Gender | "mixed";

export interface RunnerProcessedHour {
    averagePace: number | null,
    averageSpeed: number | null,
    startTime: Date,
    startRaceTime: number,
    endTime: Date,
    endRaceTime: number,
    passages: ProcessedPassage[],
}

export default interface Runner {
    id: number,
    isTeam: boolean,
    firstname: string,
    lastname: string,
    gender: Gender,
    birthYear: string,
    category: string,
    raceId: number,
}

export interface RunnerWithPassages extends Runner {
    passages: Passage[],
}

export interface RunnerWithProcessedPassages extends Runner {
    passages: ProcessedPassage[],
}

export interface RunnerWithProcessedHours extends Runner {
    hours: RunnerProcessedHour[],
}
