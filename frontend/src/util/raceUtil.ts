import { type Race, type RaceDict } from "../types/Race";

/**
 * @param race
 * @param passageCount
 * @return The total distance in meters
 */
export function getDistanceFromPassageCount(race: Race, passageCount: number): number {
    if (passageCount === 0) {
        return 0;
    }

    const initialDistance = Number(race.initialDistance);
    const lapDistance = Number(race.lapDistance);

    if (initialDistance > 0) {
        return initialDistance + lapDistance * (passageCount - 1);
    }

    return lapDistance * passageCount;
}

export function getRaceDictFromRaces<T extends Race>(races: T[]): RaceDict<T> {
    const raceDict: RaceDict<T> = {};

    for (const race of races) {
        raceDict[race.id] = race;
    }

    return raceDict;
}
