import Passage from "./Passage";

export enum Gender {
    M = "M",
    F = "F",
}

export type GenderWithMixed = Gender | "mixed";

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
