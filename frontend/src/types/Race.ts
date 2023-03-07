/**
 * An object representing a race
 */
export interface Race {
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

interface RaceWithRunnerCount extends Race {
    /**
     * The number of runners participating in the race
     */
    runnerCount: number;
}

/**
 * An object representing a race with additional admin properties
 */
interface AdminRace extends Race {
    /**
     * Whether the race is publicly displayed or not
     */
    isPublic: boolean;
}

export interface AdminRaceWithRunnerCount extends AdminRace, RaceWithRunnerCount {}

/**
 * An object whose key is a race ID and value is the corresponding race
 */
export type AdminRaceDict = Record<number, AdminRace>;

export default AdminRace;
