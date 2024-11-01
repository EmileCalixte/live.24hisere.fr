import { type Gender } from "./Gender";
import { type ProcessedPassage, type PublicPassage } from "./Passage";
import { type PublicRace } from "./Race";

/**
 * An object representing a runner
 */
export interface Runner {
  /**
   * The runner ID
   */
  id: number;

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
   * Whether the rider has stopped competing or not
   */
  stopped: boolean;

  /**
   * The ID of the race which the runner takes part
   */
  raceId: number;
}

/**
 * An object representing a runner with his passages
 */
export type RunnerWithPassages<
  TRunner extends Runner = Runner,
  TPassage extends PublicPassage = PublicPassage,
> = TRunner & {
  /**
   * The list of the runner's passages
   */
  passages: TPassage[];
};

export type RunnerWithProcessedPassages<
  TRunner extends Runner = Runner,
  TPassage extends ProcessedPassage = ProcessedPassage,
> = RunnerWithPassages<TRunner, TPassage>;

export type RunnerWithRace<TRunner extends Runner = Runner, TRace extends PublicRace = PublicRace> = TRunner & {
  race: TRace;
};

export type RunnerWithRaceAndPassages<
  TRunner extends Runner = Runner,
  TRace extends PublicRace = PublicRace,
  TPassage extends PublicPassage = PublicPassage,
> = RunnerWithRace<TRunner, TRace> & RunnerWithPassages<TRunner, TPassage>;

export interface RunnerProcessedData {
  /**
   * The total distance covered by the runner, in meters
   */
  distance: number;

  /**
   * The average speed of the runner, in km/h. Null if runner has no passage
   */
  averageSpeed: number | null;

  /**
   * The average pace of the runner, in ms/km. Null if runner has no passage
   */
  averagePace: number | null;

  /**
   * The time of the last passage of the runner. Null if runner has no passage
   */
  lastPassageTime: null | {
    /**
     * The race time at the last passage of the runner, in milliseconds
     */
    raceTime: number;

    /**
     * The date and time of the runner's last passage
     */
    time: Date;
  };
}

export type RunnerWithProcessedData<TRunner extends Runner = Runner> = TRunner & RunnerProcessedData;

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
 * An object representing a runner with the information of his race hours
 */
export type RunnerWithProcessedHours<TRunner extends Runner = Runner> = TRunner & {
  /**
   * The race hours of the runner
   */
  hours: RunnerProcessedHour[];
};
