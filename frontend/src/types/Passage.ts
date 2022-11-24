/**
 * An object representing a passage of a runner at the timing point
 */
type Passage = {
    /**
     * The passage ID
     */
    id: number;

    /**
     * A string representing the passage time, format `${YYYY}-${MM}-${DD}T{hh}:${ii}:${ss}`
     */
    time: string;
}

/**
 * An object containing computed data about a runner passage
 */
export type PassageProcessedData = {
    /**
     * The distance of the lap, in meters
     */
    lapDistance: number;

    /**
     * The duration of the lap, in milliseconds
     */
    lapDuration: number;

    /**
     * The number of the lap, null if passage is not a complete lap
     */
    lapNumber: number | null;

    /**
     * The start time of the lap
     */
    lapStartTime: Date;

    /**
     * The race time at the start of the lap, in milliseconds
     */
    lapStartRaceTime: number;

    /**
     * The end time of the lap
     */
    lapEndTime: Date;

    /**
     * The race time at the end of the lap, in milliseconds
     */
    lapEndRaceTime: number;

    /**
     * The average speed during the lap, in km/h
     */
    lapSpeed: number;

    /**
     * The average pace during the lap, in ms/km
     */
    lapPace: number;

    /**
     * The total distance traveled at the time of passage, in meters
     */
    totalDistance: number;

    /**
     * The average speed from the race start to the passage, in km/h
     */
    averageSpeedSinceRaceStart: number;

    /**
     * The average pace from the race start to the passage, in ms/km
     */
    averagePaceSinceRaceStart: number;
}

/**
 * An object representing a passage of a runner at the timing point with additionnal data about the corresponding lap
 */
export type ProcessedPassage = Passage & {
    /**
     * An object containing additionnal data about the corresponding lap
     */
    processed: PassageProcessedData;
}

export default Passage;
