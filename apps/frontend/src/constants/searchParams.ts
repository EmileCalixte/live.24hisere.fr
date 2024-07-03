export const enum SearchParam {
    CATEGORY = "category",
    GENDER = "gender",
    HIDE_AVG_SPEED = "hideAvgSpeed",
    HIDE_AVG_SPEED_EVOLUTION = "hideAvgSpeedEvolution",
    HIDE_HOUR_SPEED = "hideHourSpeed",
    HIDE_LAP_SPEED = "hideLapSpeed",
    RACE = "race",
    RANKING_TIME = "rankingTime",
    SORT_COLUMN = "sortColumn",
    SORT_DIRECTION = "sortDirection",
    TAB = "tab",
    TIME_MODE = "timeMode",
}

export const RANKING_SEARCH_PARAMS = [
    SearchParam.CATEGORY,
    SearchParam.GENDER,
    SearchParam.RACE,
    SearchParam.RANKING_TIME,
    SearchParam.TIME_MODE,
];

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
