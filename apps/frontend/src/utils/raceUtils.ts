import { type PublicRace, type RaceDict } from "@live24hisere/core/types";
import { type SelectOption } from "../types/Forms";

/**
 * @param race
 * @param date
 * @return The race time in ms
 */
export function getRaceTime(race: PublicRace, date: Date): number {
    return date.getTime() - new Date(race.startTime).getTime();
}

/**
 * @param race
 * @param serverTimeOffset in ms
 * @return The race time in ms
 */
export function getCurrentRaceTime(
    race: PublicRace,
    serverTimeOffset = 0,
): number {
    return getRaceTime(race, new Date(Date.now() + serverTimeOffset));
}

/**
 * Returns true if the race has started
 * @param race
 * @param serverTimeOffset in ms
 */
export function isRaceStarted(race: PublicRace, serverTimeOffset = 0): boolean {
    return getCurrentRaceTime(race, serverTimeOffset) >= 0;
}

/**
 * Returns true if the race is finished
 * @param race
 * @param serverTimeOffset in ms
 */
export function isRaceFinished(
    race: PublicRace,
    serverTimeOffset = 0,
): boolean {
    return getCurrentRaceTime(race, serverTimeOffset) > race.duration * 1000;
}

/**
 * Returns a Date object from a race duration
 * @param race
 * @param raceTime in ms
 */
export function getDateFromRaceTime(race: PublicRace, raceTime: number): Date {
    const raceStartDate = new Date(race.startTime);

    return new Date(raceStartDate.getTime() + raceTime);
}

/**
 * Returns an array of select options from an array of races
 * @param races
 * @param label an optional callback function to format the label
 *
 * TODO delete false from races types
 */
export function getRacesSelectOptions<TRace extends PublicRace>(
    races: TRace[] | false | undefined,
    label?: (race: TRace) => string,
): SelectOption[] {
    if (!races) {
        return [];
    }

    return races.map((race) => ({
        label: label ? label(race) : race.name,
        value: race.id,
    }));
}

/**
 * @param race
 * @param passageCount
 * @return The total distance in meters
 */
export function getDistanceFromPassageCount(
    race: PublicRace,
    passageCount: number,
): number {
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

export function getRaceDictFromRaces<TRace extends PublicRace>(
    races: TRace[],
): RaceDict<TRace> {
    const raceDict: RaceDict<TRace> = {};

    for (const race of races) {
        raceDict[race.id] = race;
    }

    return raceDict;
}
