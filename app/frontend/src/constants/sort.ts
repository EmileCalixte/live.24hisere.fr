export const enum SortDirection {
    ASC = "asc",
    DESC = "desc",
}

export const enum SortBy {
    RACE_TIME = "raceTime",
    LAP_SPEED = "lapSpeed",
}

export const RUNNER_DETAILS_LAPS_SORT_COLUMNS = [
    SortBy.RACE_TIME,
    SortBy.LAP_SPEED,
];
