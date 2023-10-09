import { type SelectOption } from "../types/Forms";
import { type Race } from "../types/Race";

/**
 * @param race
 * @param date
 * @return The race time in ms
 */
export function getRaceTime(race: Race, date: Date): number {
    return date.getTime() - new Date(race.startTime).getTime();
}

/**
 * @param race
 * @param serverTimeOffset in ms
 * @return The race time in ms
 */
export function getCurrentRaceTime(race: Race, serverTimeOffset = 0): number {
    return getRaceTime(race, new Date(Date.now() + serverTimeOffset));
}

/**
 * Returns true if the race has started
 * @param race
 * @param serverTimeOffset in ms
 */
export function isRaceStarted(race: Race, serverTimeOffset = 0): boolean {
    return getCurrentRaceTime(race, serverTimeOffset) >= 0;
}

/**
 * Returns true if the race is finished
 * @param race
 * @param serverTimeOffset in ms
 */
export function isRaceFinished(race: Race, serverTimeOffset = 0): boolean {
    return getCurrentRaceTime(race, serverTimeOffset) > race.duration * 1000;
}

/**
 * Returns an array of select options from an array of races
 * @param races
 * @param label an optional callback function to format the label
 */
export function getRacesSelectOptions<T extends Race>(races: T[] | false, label?: (race: T) => string): SelectOption[] {
    if (!races) {
        return [];
    }

    return races.map(race => ({
        label: label ? label(race) : race.name,
        value: race.id,
    }));
}
