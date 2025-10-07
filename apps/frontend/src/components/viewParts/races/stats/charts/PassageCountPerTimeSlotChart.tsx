import React from "react";
import type { ProcessedPassage, PublicRace } from "@live24hisere/core/types";
import { compareUtils } from "@live24hisere/utils";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import { useWindowDimensions } from "../../../../../hooks/useWindowDimensions";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";
import {
  getAntifreezeDataForDateXAxisChart,
  getXAxisDateInterval,
  getXAxisDateLabelValue,
} from "../../../../../utils/chartUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";
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
   * The number of passages in this time slot
   */
  passageCount: number;
}

interface PassageCountPerTimeSlotChartProps {
  race: PublicRace;
  passages: ProcessedPassage[];
  /**
   * The duration of each time slot, in milliseconds
   */
  timeSlotDuration: number;
}

export function PassageCountPerTimeSlotChart({
  race,
  passages,
  timeSlotDuration,
}: PassageCountPerTimeSlotChartProps): React.ReactElement {
  const chartTheme = useChartTheme();

  const { width: windowWidth } = useWindowDimensions();

  const sortedPassages = React.useMemo(
    () =>
      passages.toSorted((passageA, passageB) =>
        compareUtils.spaceship(passageA.processed.lapEndRaceTime, passageB.processed.lapEndRaceTime),
      ),
    [passages],
  );

  const timeSlots = React.useMemo(() => {
    const timeSlots = new Map<number, TimeSlot>();

    for (const passage of sortedPassages) {
      const passageRaceTime = passage.processed.lapEndRaceTime;
      const timeSlotStartRaceTime = passageRaceTime - (passageRaceTime % timeSlotDuration);

      if (!timeSlots.has(timeSlotStartRaceTime)) {
        timeSlots.set(timeSlotStartRaceTime, {
          startRaceTime: timeSlotStartRaceTime,
          endRaceTime: timeSlotStartRaceTime + timeSlotDuration,
          passageCount: 0,
        });
      }

      const timeSlot = timeSlots.get(timeSlotStartRaceTime);

      if (timeSlot) {
        timeSlot.passageCount += 1;
      }
    }

    return Array.from(timeSlots.values());
  }, [sortedPassages, timeSlotDuration]);

  const getTooltipContent = React.useCallback(
    (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const { x, y: passageCount } = e.entries[0].dataPoint;

      // Remove visual compensation of data point
      const slotStartRaceTime = x - timeSlotDuration / 2;

      return `De ${formatMsAsDuration(slotStartRaceTime)} à ${formatMsAsDuration(slotStartRaceTime + timeSlotDuration)} : ${passageCount} passages`;
    },
    [timeSlotDuration],
  );

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
          enabled: false,
        },
        labelFormatter: getXAxisDateLabelValue,
        minimum: 0,
        maximum: race.duration * 1000,
        intervalType: "minute",
        interval: getXAxisDateInterval(race.duration, windowWidth),
        labelAngle: -25,
      },
      axisY: {
        labelFormatter: (e: { value: number }) => formatFloatNumber(e.value, 0),
        suffix: windowWidth >= 768 ? " tours" : "",
        margin: windowWidth >= 768 ? 0 : 20,
        minimum: 0,
      },
      data: [
        {
          type: "column",
          color: "#22aa22",
          showInLegend: false,
          dataPoints: timeSlots.map((timeSlot) => ({
            // Add half of timeSlotDuration to x value to show column at the right place
            x: timeSlot.startRaceTime + timeSlotDuration / 2,
            y: timeSlot.passageCount,
          })),
        },
        getAntifreezeDataForDateXAxisChart(new Date(race.startTime)),
      ],
    }),
    [chartTheme, getTooltipContent, race.duration, race.startTime, timeSlotDuration, timeSlots, windowWidth],
  );

  return <CanvasJSChart options={options} />;
}
