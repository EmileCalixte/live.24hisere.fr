/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { type CategoryCode, getCategoryList, isCategoryCode } from "@emilecalixte/ffa-categories";
import {
  CategoryScale,
  Chart,
  type ChartData,
  type ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { GENDER } from "@live24hisere/core/constants";
import type {
  Gender,
  PublicRace,
  RaceRunnerWithProcessedPassages,
  RunnerProcessedTimeSlot,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { CATEGORY_COLORS, GENDER_COLORS } from "../../../../../constants/chart";
import { useChartGridColor } from "../../../../../hooks/charts/useChartGridColor";
import { useChartLegendColor } from "../../../../../hooks/charts/useChartLegendColor";
import { useGetRunnerCategory } from "../../../../../hooks/useGetRunnerCategory";
import { useWindowDimensions } from "../../../../../hooks/useWindowDimensions";
import { getXAxisDateInterval } from "../../../../../utils/chartUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";
import { getProcessedTimeSlotsFromPassages } from "../../../../../utils/passageUtils";
import { formatFloatNumber } from "../../../../../utils/utils";

Chart.register(CategoryScale, Filler, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip);

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
  const legendColor = useChartLegendColor();
  const gridColor = useChartGridColor();

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

  const getTimeSlotsPoints = React.useCallback(
    (timeSlots: TimeSlot[]) => [
      { x: 0, y: timeSlots[0].averageSpeed },
      ...timeSlots.map((timeSlot) => ({
        x: timeSlot.startRaceTime + timeSlotDuration,
        y: timeSlot.averageSpeed,
      })),
    ],
    [timeSlotDuration],
  );

  const data = React.useMemo<ChartData<"line">>(() => {
    if (mode === "category") {
      return {
        datasets: objectUtils.entries(categoryTimeSlots).map(([categoryCode, timeSlots]) => ({
          label: getDisplayedCategoryName(categoryCode),
          data: getTimeSlotsPoints(timeSlots),
          borderColor: CATEGORY_COLORS[categoryCode],
          backgroundColor: CATEGORY_COLORS[categoryCode],
          pointRadius: 0,
          tension: 0,
        })),
      };
    }

    if (mode === "gender") {
      return {
        datasets: objectUtils.entries(genderTimeSlots).map(([gender, timeSlots]) => ({
          label: gender === "M" ? "Hommes" : "Femmes",
          data: getTimeSlotsPoints(timeSlots),
          borderColor: GENDER_COLORS[gender as Gender],
          backgroundColor: GENDER_COLORS[gender as Gender],
          pointRadius: 0,
          tension: 0,
        })),
      };
    }

    return {
      datasets: [
        {
          data: getTimeSlotsPoints(globalAvgTimeSlots),
          borderColor: "#22aa22",
          backgroundColor: "rgba(34, 170, 34, 0.3)",
          fill: true,
          pointRadius: 0,
          tension: 0,
        },
      ],
    };
  }, [mode, categoryTimeSlots, genderTimeSlots, globalAvgTimeSlots, getDisplayedCategoryName, getTimeSlotsPoints]);

  const options = React.useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: race.duration * 1000,
          ticks: {
            stepSize: Math.max(getXAxisDateInterval(race.duration, windowWidth) * 60 * 1000, 3_600_000),
            color: legendColor,
            callback: (value) => formatMsAsDuration(Number(value)),
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          min: 0,
          ticks: {
            color: legendColor,
            callback: (value) => `${formatFloatNumber(Number(value), 0)} km/h`,
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          display: mode !== "mixed",
          position: "bottom",
          onClick: () => {},
          labels: {
            color: legendColor,
          },
        },
        datalabels: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (contexts) => {
              const x = contexts[0].parsed.x;
              return formatMsAsDuration(x ?? 0);
            },
            label: (context) => {
              const speed = formatFloatNumber(context.parsed.y ?? 0, 2);
              const label = context.dataset.label;

              if (label) {
                return `${label} : ${speed} km/h`;
              }

              return `${speed} km/h`;
            },
            afterBody: (contexts) => {
              if (mode === "mixed") {
                return "";
              }

              const dataIndex = contexts[0].dataIndex;
              // dataIndex 0 = initial point (slot 0), dataIndex i >= 1 = slot i-1
              const slotIndex = dataIndex === 0 ? 0 : dataIndex - 1;
              const globalSpeed = globalAvgTimeSlots[slotIndex]?.averageSpeed;

              return `\nMoyenne globale : ${formatFloatNumber(globalSpeed, 2)} km/h`;
            },
          },
        },
      },
    }),
    [race.duration, windowWidth, legendColor, gridColor, mode, globalAvgTimeSlots],
  );

  return (
    <div style={{ minHeight: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}
