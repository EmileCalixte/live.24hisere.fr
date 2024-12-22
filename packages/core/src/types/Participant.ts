export interface Participant {
  id: number;

  /**
   * The ID of the runner taking part to the race
   */
  runnerId: number;

  /**
   * The ID of the race which the runner takes part
   */
  raceId: number;

  /**
   * The runner's bib number in the race
   */
  bibNumber: number;

  /**
   * Whether the rider has stopped competing or not
   */
  stopped: boolean;
}
