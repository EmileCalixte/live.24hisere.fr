/**
 * An object representing a race
 */
type Race = {
    /**
     * The race ID
     */
    id: number;

    /**
     * The name of the race
     */
    name: string;

    /**
     * A string representing the start time of the race, format `${YYYY}-${MM}-${DD}T{hh}:${ii}:${ss}`
     */
    startTime: string;

    /**
     * The duration of the race, in seconds
     */
    duration: number;

    /**
     * The distance before the first lap, in meters
     */
    initialDistance: number;

    /**
     * The distance of a lap, in meters
     */
    lapDistance: number;
}

type RaceWithRunnerCount = Race & {
    /**
     * The number of runners participating in the race
     */
    runnerCount: number;
}

/**
 * An object representing a race with additional admin properties
 */
type AdminRace = Race & {
    /**
     * Whether the race is publicly displayed or not
     */
    isPublic: boolean;
}

export type AdminRaceWithRunnerCount = AdminRace & RaceWithRunnerCount;

export default AdminRace;
