import React from "react";
import { type CategoryCode, getCategoryList, isCategoryCode } from "@emilecalixte/ffa-categories";
import ReactDOMServer from "react-dom/server";
import { GENDER } from "@live24hisere/core/constants";
import type {
  Gender,
  PublicRace,
  RaceRunnerWithProcessedPassages,
  RunnerProcessedTimeSlot,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { CATEGORY_COLORS, GENDER_COLORS } from "../../../../../constants/chart";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import { useGetRunnerCategory } from "../../../../../hooks/useGetRunnerCategory";
import { useWindowDimensions } from "../../../../../hooks/useWindowDimensions";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";
import {
  getAntifreezeDataForDateXAxisChart,
  getXAxisDateInterval,
  getXAxisDateLabelValue,
} from "../../../../../utils/chartUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";
import { getProcessedTimeSlotsFromPassages } from "../../../../../utils/passageUtils";
import { formatFloatNumber } from "../../../../../utils/utils";

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

interface TimeSlot {
  /**
   * The start time of the time slot, in ms
   */
  startRaceTime: number;

  /**
   * The end time of the time slot, in ms
   */
  endRaceTime: number;

  /**
   * The average speed in this time slot, in km/h
   */
  averageSpeed: number;
}

interface AverageSpeedPerTimeSlotChartProps {
  race: PublicRace;
  runners: RaceRunnerWithProcessedPassages[];
  /**
   * The duration of each time slot, in milliseconds
   */
  timeSlotDuration: number;
  mode: "mixed" | "category" | "gender";
}

export function AverageSpeedPerTimeSlotChart({
  race,
  runners,
  timeSlotDuration,
  mode,
}: AverageSpeedPerTimeSlotChartProps): React.ReactElement {
  const chartTheme = useChartTheme();

  const { width: windowWidth } = useWindowDimensions();

  const getCategory = useGetRunnerCategory();

  const categories = React.useMemo(() => getCategoryList(new Date(race.startTime)), [race.startTime]);

  const getTimeSlots = React.useCallback(
    (runners: RaceRunnerWithProcessedPassages[]) => {
      const runnerTimeSlots = new Map<number, RunnerProcessedTimeSlot[]>();

      let timeSlotCount = 0;

      for (const runner of runners) {
        const thisRunnerTimeSlots = getProcessedTimeSlotsFromPassages(race, runner.passages, timeSlotDuration);
        timeSlotCount = thisRunnerTimeSlots.length;
        runnerTimeSlots.set(runner.id, thisRunnerTimeSlots);
      }

      const timeSlots: TimeSlot[] = [];

      for (let i = 0; i < timeSlotCount; i += 1) {
        const timeSlotStartRaceTime = i * timeSlotDuration;
        const timeSlotEndRaceTime = timeSlotStartRaceTime + timeSlotDuration;

        const sum = Array.from(runnerTimeSlots.values()).reduce(
          (total, timeSlots) => total + (timeSlots[i].averageSpeed ?? 0),
          0,
        );
        const averageSpeed = sum / runners.length;

        timeSlots.push({
          startRaceTime: timeSlotStartRaceTime,
          endRaceTime: timeSlotEndRaceTime,
          averageSpeed,
        });
      }

      return timeSlots;
    },
    [race, timeSlotDuration],
  );

  const globalAvgTimeSlots = React.useMemo(() => getTimeSlots(runners), [getTimeSlots, runners]);

  const categoryTimeSlots = React.useMemo<Record<CategoryCode | "custom", TimeSlot[]>>(() => {
    const raceStartDate = new Date(race.startTime);

    const categoryRunners: Partial<Record<CategoryCode | "custom", RaceRunnerWithProcessedPassages[]>> =
      objectUtils.fromEntries([...objectUtils.keys(categories), "custom"].map((categoryCode) => [categoryCode, []]));

    for (const runner of runners) {
      const categoryCode = getCategory(runner, raceStartDate).code;
      const index = isCategoryCode(categoryCode) ? categoryCode : "custom";

      if (!(index in categoryRunners)) {
        categoryRunners[index] = [];
      }

      categoryRunners[index]?.push(runner);
    }

    return objectUtils.fromEntries(
      objectUtils
        .entries(
          objectUtils.fromEntries(objectUtils.entries(categoryRunners).filter(([, runners]) => runners.length > 0)),
        )
        .map(([categoryCode, runners]) => [categoryCode, getTimeSlots(runners)]),
    );
  }, [categories, getCategory, getTimeSlots, race.startTime, runners]);

  const genderTimeSlots = React.useMemo(() => {
    const maleRunners = runners.filter((r) => r.gender === GENDER.M);
    const femaleRunners = runners.filter((r) => r.gender === GENDER.F);

    return {
      [GENDER.M]: getTimeSlots(maleRunners),
      [GENDER.F]: getTimeSlots(femaleRunners),
    };
  }, [getTimeSlots, runners]);

  const getDisplayedCategoryName = React.useCallback(
    (categoryCode: string) => {
      const displayedCategoryCode = categoryCode === "custom" ? "Autres" : categoryCode;
      return (categories as Record<string, string>)[categoryCode] ?? displayedCategoryCode;
    },
    [categories],
  );

  const getDisplayedGender = React.useCallback((gender: Gender) => {
    if (gender === GENDER.F) {
      return "Femmes";
    }

    return "Hommes";
  }, []);

  const getTooltipContent = React.useCallback(
    (e: any) => {
      if (mode === "category") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const { x: slotStartRaceTime, timeSlotIndex } = e.entries[0].dataPoint as { x: number; timeSlotIndex: number };

        return ReactDOMServer.renderToString(
          <div>
            <div style={{ marginBottom: "0.75em" }}>{formatMsAsDuration(slotStartRaceTime)} :</div>

            {objectUtils.entries(categoryTimeSlots).map(([categoryCode, timeSlots]) => (
              <div key={categoryCode}>
                <strong style={{ color: CATEGORY_COLORS[categoryCode] }}>
                  {getDisplayedCategoryName(categoryCode)}
                </strong>
                <> </>:<> </>
                {formatFloatNumber(timeSlots[timeSlotIndex].averageSpeed, 2)} km/h
              </div>
            ))}
          </div>,
        );
      }

      if (mode === "gender") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const { x: slotStartRaceTime, timeSlotIndex } = e.entries[0].dataPoint as { x: number; timeSlotIndex: number };

        return ReactDOMServer.renderToString(
          <div>
            <div style={{ marginBottom: "0.75em" }}>{formatMsAsDuration(slotStartRaceTime)} :</div>

            {objectUtils.entries(genderTimeSlots).map(([gender, timeSlots]) => (
              <div key={gender}>
                <strong style={{ color: GENDER_COLORS[gender] }}>{getDisplayedGender(gender)}</strong>
                <> </>:<> </>
                {formatFloatNumber(timeSlots[timeSlotIndex].averageSpeed, 2)} km/h
              </div>
            ))}
          </div>,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const { x: slotStartRaceTime, y: averageSpeed } = e.entries[0].dataPoint;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return `${formatMsAsDuration(slotStartRaceTime)} : ${formatFloatNumber(averageSpeed, 2)} km/h`;
    },
    [categoryTimeSlots, genderTimeSlots, getDisplayedCategoryName, getDisplayedGender, mode],
  );

  const getTimeSlotsDataPoints = React.useCallback(
    (timeSlots: TimeSlot[]) => [
      { x: 0, y: timeSlots[0].averageSpeed, timeSlotIndex: 0 },
      ...timeSlots.map((timeSlot, index) => ({
        x: timeSlot.startRaceTime + timeSlotDuration,
        y: timeSlot.averageSpeed,
        timeSlotIndex: index,
      })),
    ],
    [timeSlotDuration],
  );

  const getData = React.useCallback(() => {
    if (mode === "category") {
      return objectUtils.entries(categoryTimeSlots).map(([categoryCode, timeSlots]) => {
        const categoryName = getDisplayedCategoryName(categoryCode);

        return {
          type: "line",
          color: CATEGORY_COLORS[categoryCode],
          showInLegend: true,
          legendText: categoryName,
          markerType: "none",
          dataPoints: getTimeSlotsDataPoints(timeSlots),
        };
      });
    }

    if (mode === "gender") {
      return objectUtils.entries(genderTimeSlots).map(([gender, timeSlots]) => ({
        type: "line",
        color: GENDER_COLORS[gender],
        showInLegend: true,
        legendText: gender === "M" ? "Hommes" : "Femmes",
        markerType: "none",
        dataPoints: getTimeSlotsDataPoints(timeSlots),
      }));
    }

    return [
      {
        type: "area",
        color: "#22aa22",
        showInLegend: false,
        markerType: "none",
        dataPoints: getTimeSlotsDataPoints(globalAvgTimeSlots),
      },
    ];
  }, [categoryTimeSlots, genderTimeSlots, getDisplayedCategoryName, getTimeSlotsDataPoints, globalAvgTimeSlots, mode]);

  const options = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      theme: chartTheme,
      toolTip: {
        enabled: true,
        contentFormatter: getTooltipContent,
      },
      axisX: {
        crosshair: {
          enabled: true,
          labelFormatter: () => null,
        },
        labelFormatter: getXAxisDateLabelValue,
        minimum: 0,
        maximum: race.duration * 1000,
        intervalType: "minute",
        interval: getXAxisDateInterval(race.duration, windowWidth),
        labelAngle: -25,
      },
      axisY: {
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
          labelFormatter: () => null,
        },
        labelFormatter: (e: { value: number }) => formatFloatNumber(e.value, 0),
        suffix: " km/h",
        minimum: 0,
      },
      data: [...getData(), getAntifreezeDataForDateXAxisChart(new Date(race.startTime))],
    }),
    [chartTheme, getTooltipContent, race.duration, race.startTime, windowWidth, getData],
  );

  return <CanvasJSChart options={options} />;
}
