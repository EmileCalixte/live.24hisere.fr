export const enum SearchParam {
    HIDE_AVG_SPEED = "hideAvgSpeed",
    HIDE_AVG_SPEED_EVOLUTION = "hideAvgSpeedEvolution",
    HIDE_HOUR_SPEED = "hideHourSpeed",
    HIDE_LAP_SPEED = "hideLapSpeed",
    SORT_COLUMN = "sortColumn",
    SORT_DIRECTION = "sortDirection",
    TAB = "tab",
}

export const RUNNER_SPEED_CHART_SEARCH_PARAMS = [
    SearchParam.HIDE_AVG_SPEED,
    SearchParam.HIDE_AVG_SPEED_EVOLUTION,
    SearchParam.HIDE_HOUR_SPEED,
    SearchParam.HIDE_LAP_SPEED,
];

export const RUNNER_LAPS_TABLE_SEARCH_PARAMS = [
    SearchParam.SORT_COLUMN,
    SearchParam.SORT_DIRECTION,
];
