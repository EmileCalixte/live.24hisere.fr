import type { GenderWithMixed } from "@live24hisere/core/types";
import type { TrackedEvent } from "../constants/eventTracking/customEventNames";
import type { RankingTimeMode } from "../constants/rankingTimeMode";
import type { SortColumn, SortDirection } from "../constants/sort";

export type TrackedEventLabel = (typeof TrackedEvent)[keyof typeof TrackedEvent];

/**
 * Type that specifies the data to be recorded according to a tracked event.
 *
 * Tracked events that have no additional data associated with them are not included in this type.
 */
export interface EventTrackingData {
  [TrackedEvent.CHANGE_EDITION]: { editionId: number };
  [TrackedEvent.CHANGE_RACE]: { raceId: number };

  [TrackedEvent.CHANGE_RANKING_CATEGORY]: { category: string };
  [TrackedEvent.CHANGE_RANKING_GENDER]: { gender: GenderWithMixed };
  [TrackedEvent.CHANGE_RANKING_TIME_MODE]: { timeMode: RankingTimeMode };
  [TrackedEvent.CHANGE_RANKING_TIME]: { time: number };

  [TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_LAP_SPEED]: { newValue: boolean };
  [TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_HOUR_SPEED]: { newValue: boolean };
  [TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_AVG_SPEED]: { newValue: boolean };
  [TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_AVG_SPEED_EVOLUTION]: { newValue: boolean };

  [TrackedEvent.DOWNLOAD_RUNNER_LAPS_XLSX]: { raceId: number; runnerId: number };

  [TrackedEvent.CHANGE_RUNNER_LAPS_TABLE_SORT]: { newSortColumn: SortColumn; newSortDirection: SortDirection };
}

/**
 * Type representing tracked event names which require additional data
 */
export type TrackedEventWithDataLabel = keyof EventTrackingData;

/**
 * Type representing tracked event names which don't require additional data
 */
export type TrackedEventWithoutDataLabel = Exclude<TrackedEventLabel, TrackedEventWithDataLabel>;
