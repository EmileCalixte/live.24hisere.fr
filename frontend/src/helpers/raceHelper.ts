import {type Race} from "../types/Race";

/**
 * @param race
 * @param serverTimeOffset
 * @returns The race time in ms
 */
export function getRaceTime(race: Race, serverTimeOffset = 0): number {
    const raceStartMs = new Date(race.startTime).getTime();
    const nowMs = (new Date()).getTime() + (serverTimeOffset);

    return nowMs - raceStartMs;
}

/**
 * Returns true if the race has started
 * @param race
 * @param serverTimeOffset in ms
 */
export function isRaceStarted(race: Race, serverTimeOffset = 0): boolean {
    return getRaceTime(race, serverTimeOffset) >= 0;
}

/**
 * Returns true if the race is finished
 * @param race
 * @param serverTimeOffset in ms
 */
export function isRaceFinished(race: Race, serverTimeOffset = 0): boolean {
    return getRaceTime(race, serverTimeOffset) > race.duration * 1000;
}
