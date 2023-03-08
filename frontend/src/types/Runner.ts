import {type AdminPassage, type AdminProcessedPassage, type ProcessedPassage} from "./Passage";
import type Passage from "./Passage";
import {type Race} from "./Race";

/**
 * Represents the gender of a runner
 */
export enum Gender {
    M = "M",
    F = "F",
}

/**
 * Represents the gender of a runner with an additionnal "mixed" option
 */
export type GenderWithMixed = Gender | "mixed";

/**
 * An object containing the information of a runner's race hour
 */
export interface RunnerProcessedHour {
    /**
     * The start time of the hour
     */
    startTime: Date;

    /**
     * The race time at the start of the hour, in milliseconds
     */
    startRaceTime: number;

    /**
     * The end time of the hour
     */
    endTime: Date;

    /**
     * The race time at the end of the hour, in milliseconds
     */
    endRaceTime: number;

    /**
     * The average speed of the runner during the hour, in km/h
     */
    averageSpeed: number | null;

    /**
     * The average pace of the runner during the hour, in ms/km
     */
    averagePace: number | null;

    /**
     * The passages included in the hour
     */
    passages: ProcessedPassage[];
}

/**
 * An object representing a runner
 */
interface Runner {
    /**
     * The runner ID
     */
    id: number;

    /**
     * Whether the runner is a team or not
     * @deprecated
     */
    isTeam: boolean;

    /**
     * The firstname of the runner
     */
    firstname: string;

    /**
     * The lastname of the runner
     */
    lastname: string;

    /**
     * The gender of the runner
     */
    gender: Gender;

    /**
     * The birth year of the runner
     */
    birthYear: string;

    /**
     * The category short code of the runner
     */
    category: string;

    /**
     * The ID of the race which the runner takes part
     */
    raceId: number;
}

/**
 * An object representing a runner with his passages
 */
export interface RunnerWithPassages extends Runner {
    /**
     * The list of the runner's passages
     */
    passages: Passage[];
}

/**
 * An object representing a runner with passages and with additional admin info
 */
export interface RunnerWithAdminPassages extends Runner {
    /**
     * The list of the runner's passages with additional admin info
     */
    passages: AdminPassage[];
}

/**
 * An object representing a runner with his passages and with additional data on the passages
 */
export interface RunnerWithProcessedPassages extends Runner {
    /**
     * The list of the runner's passages with additional data
     */
    passages: ProcessedPassage[];
}

/**
 * An object representing a runner with passages and with additional admin info and additional data on the passages
 */
export interface RunnerWithAdminProcessedPassages extends Runner {
    /**
     * The list of the runner's passages with additional admin info and additional data
     */
    passages: AdminProcessedPassage[];
}

/**
 * An object representing a runner with the information of his race hours
 */
export interface RunnerWithProcessedHours extends Runner {
    /**
     * The race hours of the runner
     */
    hours: RunnerProcessedHour[];
}

/**
 * An object representing a runner with additional data about his race
 */
export interface RunnerWithRace extends Runner {
    /**
     * The race in which the runner takes part
     */
    race: Race;
}

export default Runner;
