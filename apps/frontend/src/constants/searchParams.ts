export const enum SearchParam {
  CATEGORY = "category",
  GENDER = "gender",
  RACE = "race",
  RANKING_TIME = "rankingTime",
  SHOW_AVG_SPEED = "showAvgSpeed",
  SHOW_AVG_SPEED_EVOLUTION = "showAvgSpeedEvolution",
  SHOW_HOUR_SPEED = "showHourSpeed",
  SHOW_LAP_SPEED = "showLapSpeed",
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
  SearchParam.SHOW_AVG_SPEED,
  SearchParam.SHOW_AVG_SPEED_EVOLUTION,
  SearchParam.SHOW_HOUR_SPEED,
  SearchParam.SHOW_LAP_SPEED,
];

export const RUNNER_LAPS_TABLE_SEARCH_PARAMS = [SearchParam.SORT_COLUMN, SearchParam.SORT_DIRECTION];
