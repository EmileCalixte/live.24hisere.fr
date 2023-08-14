import { type Race, type RaceDict } from "../types/Race";

export function getRaceDictFromRaces<T extends Race>(races: T[]): RaceDict<T> {
    const raceDict: RaceDict<T> = {};

    for (const race of races) {
        raceDict[race.id] = race;
    }

    return raceDict;
}
