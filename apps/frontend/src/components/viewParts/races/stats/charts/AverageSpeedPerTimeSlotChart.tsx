import React from "react";
import type { PublicRace, RaceRunnerWithProcessedPassages, RunnerProcessedTimeSlot } from "@live24hisere/core/types";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
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
}

export function AverageSpeedPerTimeSlotChart({
  race,
  runners,
  timeSlotDuration,
}: AverageSpeedPerTimeSlotChartProps): React.ReactElement {
  const chartTheme = useChartTheme();

  const { width: windowWidth } = useWindowDimensions();

  const timeSlots = React.useMemo(() => {
    const runnerTimeSlots = new Map<number, RunnerProcessedTimeSlot[]>();

    let timeSlotCount = 0;

    for (const runner of runners) {
      const thisRunnerTimeSlots = getProcessedTimeSlotsFromPassages(race, runner.passages, timeSlotDuration);
      timeSlotCount = thisRunnerTimeSlots.length;
      runnerTimeSlots.set(runner.id, thisRunnerTimeSlots);
    }

    const timeSlots: TimeSlot[] = [];

    for (let i = 0; i < timeSlotCount; ++i) {
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
  }, [race, runners, timeSlotDuration]);

  const getTooltipContent = React.useCallback((e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const { x: slotStartRaceTime, y: averageSpeed } = e.entries[0].dataPoint;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return `${formatMsAsDuration(slotStartRaceTime)} : ${formatFloatNumber(averageSpeed, 2)} km/h`;
  }, []);

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
      data: [
        {
          type: "area",
          color: "#22aa22",
          showInLegend: false,
          markerType: "none",
          dataPoints: [
            { x: 0, y: timeSlots[0].averageSpeed },
            ...timeSlots.map((timeSlot) => ({
              // Add half of timeSlotDuration to x value to show column at the right place
              x: timeSlot.startRaceTime + timeSlotDuration,
              y: timeSlot.averageSpeed,
            })),
          ],
        },
        getAntifreezeDataForDateXAxisChart(new Date(race.startTime)),
      ],
    }),
    [chartTheme, getTooltipContent, race.duration, race.startTime, timeSlotDuration, timeSlots, windowWidth],
  );

  return <CanvasJSChart options={options} />;
}
