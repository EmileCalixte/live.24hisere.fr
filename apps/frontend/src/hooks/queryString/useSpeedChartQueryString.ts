import React from "react";
import { SearchParam } from "../../constants/searchParams";
import { useQueryString } from "./useQueryString";

interface UseSpeedChartQueryString {
  displayEachLapSpeed: boolean;
  displayEachHourSpeed: boolean;
  displayAverageSpeed: boolean;
  displayAverageSpeedEvolution: boolean;
  toggleSearchParam: (param: SearchParam) => void;
}

export function useSpeedChartQueryString(): UseSpeedChartQueryString {
  const { searchParams, setParams, deleteParams } = useQueryString();

  const toggleSearchParam = React.useCallback(
    (param: SearchParam) => {
      if (searchParams.has(param)) {
        deleteParams(param);
        return;
      }

      setParams({ [param]: "" });
    },
    [deleteParams, searchParams, setParams],
  );

  const displayEachLapSpeed = React.useMemo(() => !searchParams.has(SearchParam.HIDE_LAP_SPEED), [searchParams]);
  const displayEachHourSpeed = React.useMemo(() => !searchParams.has(SearchParam.HIDE_HOUR_SPEED), [searchParams]);
  const displayAverageSpeed = React.useMemo(() => !searchParams.has(SearchParam.HIDE_AVG_SPEED), [searchParams]);
  const displayAverageSpeedEvolution = React.useMemo(
    () => !searchParams.has(SearchParam.HIDE_AVG_SPEED_EVOLUTION),
    [searchParams],
  );

  return {
    displayEachLapSpeed,
    displayEachHourSpeed,
    displayAverageSpeed,
    displayAverageSpeedEvolution,
    toggleSearchParam,
  };
}
