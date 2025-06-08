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
   * The ID of the custom category to which the runner belongs
   */
  customCategoryId: number | null;

  /**
   * Whether the runner has stopped competing or not
   */
  stopped: boolean;

  /**
   * Distance covered by the runner after his last passage, in meters (decimal)
   */
  finalDistance: string;
}
