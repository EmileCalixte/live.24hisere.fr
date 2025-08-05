import type { Gender } from "./Gender";
import type { Participant } from "./Participant";
import type { AdminPassage, ProcessedPassage, PublicPassage } from "./Passage";
import type { PublicRace } from "./Race";

/**
 * An object representing a runner
 */
export interface PublicRunner {
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
   * The ISO 3166-1 Alpha-3 code of the runner's country
   */
  countryCode: string | null;
}

export interface AdminRunner extends PublicRunner {
  /**
   * Whether the runner is publicly displayed or not
   */
  isPublic: boolean;
}

export type RunnerWithRaceCount<TRunner extends PublicRunner = PublicRunner> = TRunner & {
  /**
   * The number of races in which the runner is a participant
   */
  raceCount: number;
};

/**
 * An object representing a runner participating in a race
 */
export type RaceRunner<TRunner extends PublicRunner = PublicRunner> = TRunner & Omit<Participant, "id" | "runnerId">;

/**
 * An object representing a runner with his passages
 */
export type RaceRunnerWithPassages<
  TRunner extends RaceRunner = RaceRunner,
  TPassage extends PublicPassage = PublicPassage,
> = TRunner & {
  /**
   * The list of the runner's passages
   */
  passages: TPassage[];
};

export type AdminRaceRunnerWithPassages = RaceRunnerWithPassages<RaceRunner<AdminRunner>, AdminPassage>;

export type RaceRunnerWithProcessedPassages<
  TRunner extends RaceRunner = RaceRunner,
  TPassage extends ProcessedPassage = ProcessedPassage,
> = RaceRunnerWithPassages<TRunner, TPassage>;

export type RunnerWithRace<TRunner extends RaceRunner = RaceRunner, TRace extends PublicRace = PublicRace> = TRunner & {
  race: TRace;
};

export type RunnerWithRaceAndPassages<
  TRunner extends RaceRunner = RaceRunner,
  TRace extends PublicRace = PublicRace,
  TPassage extends PublicPassage = PublicPassage,
> = RunnerWithRace<TRunner, TRace> & RaceRunnerWithPassages<TRunner, TPassage>;

export interface RunnerProcessedData {
  /**
   * The total distance covered by the runner, in meters
   */
  totalDistance: number;

  /**
   * The distance covered by the runner in meters, from the start of the race to his last passage.
   *
   * This distance **doesn't** take into account the possible distance after the last passage of the runner
   */
  distanceToLastPassage: number;

  /**
   * The average speed of the runner in km/h, from the start of the race to his last passage. Null if runner has no passage
   *
   * This average speed **doesn't** take into account the possible distance after the last passage of the runner
   */
  averageSpeedToLastPassage: number | null;

  /**
   * The average pace of the runner in ms/km, from the start of the race to his last passage. Null if runner has no passage
   *
   * This average pace **doesn't** take into account the possible distance after the last passage of the runner
   */
  averagePaceToLastPassage: number | null;

  /**
   * The average speed of the runner, in km/h.
   *
   * - If the runner has a non-zero distance after last passage, it's the average speed from start to end of the race
   * - Otherwise, it's from the start of the race to his last passage
   *
   * Null if runner has no passage
   */
  totalAverageSpeed: number | null;

  /**
   * The average pace of the runner, in ms/km.
   *
   * - If the runner has a non-zero distance after last passage, it's the average pace from start to end of the race
   * - Otherwise, it's from the start of the race to his last passage
   *
   * Null if runner has no passage
   */
  totalAveragePace: number | null;

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

export type RaceRunnerWithProcessedData<TRunner extends RaceRunner = RaceRunner> = TRunner & RunnerProcessedData;

/**
 * An object containing the information of a runner's race hour
 */
export interface RunnerProcessedTimeSlot {
  /**
   * The start time of the time slot
   */
  startTime: Date;

  /**
   * The race time at the start of the time slot, in milliseconds
   */
  startRaceTime: number;

  /**
   * The end time of the time slot
   */
  endTime: Date;

  /**
   * The race time at the end of the time slot, in milliseconds
   */
  endRaceTime: number;

  /**
   * The average speed of the runner during the time slot, in km/h
   */
  averageSpeed: number | null;

  /**
   * The average pace of the runner during the time slot, in ms/km
   */
  averagePace: number | null;

  /**
   * The passages included in the time slot
   */
  passages: ProcessedPassage[];
}

/**
 * An object representing a runner with the information of his race hours
 */
export type RunnerWithProcessedHours<TRunner extends RaceRunner = RaceRunner> = TRunner & {
  /**
   * The race hours of the runner
   */
  hours: RunnerProcessedTimeSlot[];
};
