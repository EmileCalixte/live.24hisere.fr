import type { RaceRunner } from "./Runner";
import type { DateISOString } from "./utils/dates";

/**
 * An object representing a race
 */
export interface PublicRace {
  /**
   * The race ID
   */
  id: number;

  /**
   * The name of the race
   */
  name: string;

  /**
   * A string representing the start date and time of the race
   */
  startTime: DateISOString;

  /**
   * The duration of the race, in seconds
   */
  duration: number;

  /**
   * The distance before the first lap, in meters (decimal)
   */
  initialDistance: string;

  /**
   * The distance of a lap, in meters (decimal)
   */
  lapDistance: string;
}

/**
 * An object representing a race with additional admin properties
 */
export type AdminRace<TRace extends PublicRace = PublicRace> = TRace & {
  /**
   * Whether the race is publicly displayed or not
   */
  isPublic: boolean;

  /**
   * The ID of the edition the race belongs to
   */
  editionId: number;
};

export type AdminRaceWithOrder<TRace extends AdminRace = AdminRace> = TRace & {
  /**
   * Number used to order races
   */
  order: number;
};

export type RaceWithRunners<TRace extends PublicRace = PublicRace, TRunner extends RaceRunner = RaceRunner> = TRace & {
  runners: TRunner[];
};

export type RaceWithRunnerCount<TRace extends PublicRace = PublicRace> = TRace & {
  /**
   * The number of runners participating in the race
   */
  runnerCount: number;
};

export type AdminRaceWithRunnerCount<TRace extends AdminRace = AdminRace> = RaceWithRunnerCount<TRace>;

/**
 * An object whose key is a race ID and value is the corresponding race
 */
export type RaceDict<TRace extends PublicRace = PublicRace> = Record<string, TRace>;
