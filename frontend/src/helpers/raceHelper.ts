/**
 * @param race
 * @param serverTimeOffset in ms
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
