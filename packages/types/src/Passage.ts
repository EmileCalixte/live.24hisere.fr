import { type DateISOString } from "./Date";

/**
 * An object representing a passage of a runner at the timing point
 */
export interface PublicPassage<
    TimeAsString extends boolean | undefined = undefined,
> {
    /**
     * The passage ID
     */
    id: number;

    /**
     * The passage date and time
     */
    time: TimeAsString extends undefined
        ? DateISOString | Date
        : TimeAsString extends true
          ? DateISOString
          : Date;
}

export type PassageWithRunnerId<
    TPassage extends PublicPassage = PublicPassage,
> = TPassage & {
    /**
     * The ID of the runner of the passage
     */
    runnerId: number;
};

/**
 * An object representing a passage of a runner at the timing point with additional admin info
 */
export type AdminPassage<
    TPassage extends PublicPassage = PublicPassage,
    ImportTimeAsString extends boolean | undefined = undefined,
> = TPassage & {
    /**
     * Not null if the passage comes from a detection of the timing system
     */
    detectionId: number | null;

    /**
     * Not null if the passage comes from a detection of the timing system
     */
    importTime: null | ImportTimeAsString extends undefined
        ? DateISOString | Date
        : ImportTimeAsString extends true
          ? DateISOString
          : Date;

    /**
     * Whether the passage is hidden from public view (if true, the passage is ignored for rankings and statistics)
     */
    isHidden: boolean;
};

export type AdminPassageWithRunnerId<
    TPassage extends AdminPassage = AdminPassage,
> = PassageWithRunnerId<TPassage>;

/**
 * An object containing computed data about a runner passage
 */
export interface PassageProcessedData {
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
export type ProcessedPassage<TPassage extends PublicPassage = PublicPassage> =
    TPassage & {
        /**
         * An object containing additionnal data about the corresponding lap
         */
        processed: PassageProcessedData;
    };

/**
 * An object representing a passage of a runner at the timing point with additional admin info and additional data
 * about the corresponding lap
 */
export type AdminProcessedPassage = ProcessedPassage<AdminPassage>;
