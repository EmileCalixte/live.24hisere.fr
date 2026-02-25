import React from "react";
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
import type { ProcessedPassage, PublicRace } from "@live24hisere/core/types";
import { compareUtils } from "@live24hisere/utils";
import { useChartGridColor } from "../../../../../hooks/charts/useChartGridColor";
import { useChartLegendColor } from "../../../../../hooks/charts/useChartLegendColor";
import { useWindowDimensions } from "../../../../../hooks/useWindowDimensions";
import { getXAxisDateInterval } from "../../../../../utils/chartUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";
import { formatFloatNumber } from "../../../../../utils/utils";

Chart.register(CategoryScale, Filler, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip);

interface CumulatedDistanceChartProps {
  race: PublicRace;
  passages: ProcessedPassage[];
  /**
   * The total cumulated distance of all runners, in meters.
   * When provided, a final datapoint is added at the race end time with this value.
   * Should only be provided when the race is finished.
   */
  finalCumulatedDistance: number | undefined;
}

export function CumulatedDistanceChart({
  race,
  passages,
  finalCumulatedDistance,
}: CumulatedDistanceChartProps): React.ReactElement {
  const legendColor = useChartLegendColor();
  const gridColor = useChartGridColor();

  const { width: windowWidth } = useWindowDimensions();

  const chartPoints = React.useMemo(() => {
    const sorted = passages.toSorted((a, b) =>
      compareUtils.spaceship(a.processed.lapEndRaceTime, b.processed.lapEndRaceTime),
    );

    const raceDurationMs = race.duration * 1000;

    // Aggregate lap distances by timestamp: passages sharing the same lapEndRaceTime
    // are merged into a single datapoint to avoid duplicate x values, which would cause
    // inconsistent tooltip behaviour and unnecessary rendered points.
    const distanceByTime = new Map<number, number>();

    for (const passage of sorted) {
      const raceTime = passage.processed.lapEndRaceTime;

      // Use >= so that passages at exactly raceDurationMs are excluded for isImmediateStop races.
      // This prevents duplicate datapoints at the same x, which would cause the tooltip to show
      // the passage point instead of the final point added below with finalCumulatedDistance.
      if (race.isImmediateStop && raceTime >= raceDurationMs) {
        continue;
      }

      distanceByTime.set(raceTime, (distanceByTime.get(raceTime) ?? 0) + passage.processed.lapDistance);
    }

    let cumulatedDistance = 0;
    const points: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }];

    for (const [raceTime, lapDistance] of distanceByTime) {
      cumulatedDistance += lapDistance;
      points.push({ x: raceTime, y: cumulatedDistance });
    }

    if (race.isImmediateStop && finalCumulatedDistance) {
      points.push({ x: raceDurationMs, y: finalCumulatedDistance });
    }

    return points;
  }, [passages, race, finalCumulatedDistance]);

  const data = React.useMemo<ChartData<"line">>(
    () => ({
      datasets: [
        {
          data: chartPoints,
          borderColor: "#5a79d6",
          backgroundColor: "rgba(90, 121, 214, 0.3)",
          fill: true,
          pointRadius: 0,
          tension: 0,
        },
      ],
    }),
    [chartPoints],
  );

  const options = React.useMemo<ChartOptions<"line">>(() => {
    // stepSize is always a whole number of hours (minimum 1h) so that X axis ticks fall on round values
    const stepSize = Math.max(getXAxisDateInterval(race.duration, windowWidth) * 60 * 1000, 3_600_000);

    // If the race stops immediately at the end, the last datapoint is the race end time.
    // Otherwise (runners finish their current lap), the chart ends at the last passage time,
    // but always at least at the race end time (including when there are no passages yet).
    const xMax =
      race.isImmediateStop || chartPoints.length <= 1
        ? race.duration * 1000
        : Math.max(chartPoints[chartPoints.length - 1].x, race.duration * 1000);

    return {
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
          max: xMax,
          // Chart.js's built-in tick generation would produce non-round ticks when max is not
          // a multiple of stepSize. afterBuildTicks overrides this by explicitly placing ticks
          // at 0, stepSize, 2×stepSize, ... so they always land on round hour values,
          // even if the last tick does not reach the edge of the chart.
          afterBuildTicks: (scale) => {
            const ticks: Array<{ value: number }> = [];

            for (let v = 0; v <= scale.max; v += stepSize) {
              ticks.push({ value: v });
            }

            // eslint-disable-next-line no-param-reassign
            scale.ticks = ticks;
          },
          ticks: {
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
            callback: (value) => `${formatFloatNumber(Number(value) / 1000, 0)} km`,
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
        tooltip: {
          enabled: true,
          callbacks: {
            title: (contexts) => formatMsAsDuration(contexts[0].parsed.x ?? 0),
            label: (context) => `${formatFloatNumber((context.parsed.y ?? 0) / 1000, 2)} km`,
          },
        },
      },
    };
  }, [race, chartPoints, windowWidth, legendColor, gridColor]);

  return (
    <div style={{ minHeight: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}
