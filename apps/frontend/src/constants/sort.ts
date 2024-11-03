export const enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export const enum SortColumn {
  RACE_TIME = "raceTime",
  LAP_SPEED = "lapSpeed",
}

export const RUNNER_DETAILS_LAPS_SORT_COLUMNS = [SortColumn.RACE_TIME, SortColumn.LAP_SPEED];
