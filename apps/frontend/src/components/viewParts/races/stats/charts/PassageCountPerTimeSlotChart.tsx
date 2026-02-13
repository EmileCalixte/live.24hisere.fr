import React from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartData,
  type ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import type { ProcessedPassage, PublicRace } from "@live24hisere/core/types";
import { compareUtils } from "@live24hisere/utils";
import { useChartGridColor } from "../../../../../hooks/charts/useChartGridColor";
import { useChartLegendColor } from "../../../../../hooks/charts/useChartLegendColor";
import { useWindowDimensions } from "../../../../../hooks/useWindowDimensions";
import { getXAxisDateInterval } from "../../../../../utils/chartUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip, ChartDataLabels);

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
  const legendColor = useChartLegendColor();
  const gridColor = useChartGridColor();

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

    const raceDurationMs = race.duration * 1000;

    for (const passage of sortedPassages) {
      const passageRaceTime = passage.processed.lapEndRaceTime;

      // Exclude passages that have taken place after the end of the race
      // to prevent the chart from displaying an extra column
      if (passageRaceTime > raceDurationMs) {
        continue;
      }

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
  }, [sortedPassages, timeSlotDuration, race.duration]);

  const data = React.useMemo<ChartData<"bar">>(
    () => ({
      labels: timeSlots.map((timeSlot) => timeSlot.startRaceTime + timeSlotDuration / 2),
      datasets: [
        {
          data: timeSlots.map((timeSlot) => timeSlot.passageCount),
          backgroundColor: "#22aa22",
        },
      ],
    }),
    [timeSlots, timeSlotDuration],
  );

  const options = React.useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
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
            color: "transparent",
          },
        },
        y: {
          min: 0,
          suggestedMax: Math.ceil(Math.max(0, ...timeSlots.map((ts) => ts.passageCount)) * 1.1),
          ticks: {
            color: legendColor,
            callback: (value) => {
              const suffix = windowWidth >= 768 ? " tours" : "";
              return `${value}${suffix}`;
            },
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: windowWidth / timeSlots.length >= 40, // prevent data labels from overlapping if the window is not wide enough
          anchor: "end",
          align: "end",
          color: legendColor,
          font: {
            weight: "bold",
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: () => [],
            label: (context) => {
              const slotCenterTime = context.parsed.x;
              const slotStartRaceTime = (slotCenterTime ?? timeSlotDuration / 2) - timeSlotDuration / 2;
              const passageCount = context.parsed.y;

              return `De ${formatMsAsDuration(slotStartRaceTime)} à ${formatMsAsDuration(slotStartRaceTime + timeSlotDuration)} : ${passageCount} passages`;
            },
          },
        },
      },
    }),
    [race.duration, windowWidth, legendColor, gridColor, timeSlotDuration, timeSlots],
  );

  return (
    <div style={{ minHeight: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
