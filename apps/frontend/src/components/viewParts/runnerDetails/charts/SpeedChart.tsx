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
import { parseAsBoolean, useQueryState } from "nuqs";
import { Line } from "react-chartjs-2";
import type { PublicRace, RaceRunnerWithProcessedPassages, RunnerWithProcessedHours } from "@live24hisere/core/types";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { SearchParam } from "../../../../constants/searchParams";
import { useChartGridColor } from "../../../../hooks/charts/useChartGridColor";
import { useChartLegendColor } from "../../../../hooks/charts/useChartLegendColor";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { getXAxisDateInterval } from "../../../../utils/chartUtils";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { Card } from "../../../ui/Card";
import { Checkbox } from "../../../ui/forms/Checkbox";

Chart.register(CategoryScale, Filler, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip);

const DEFAULT_MIN_SPEED = 0;
const DEFAULT_MAX_SPEED = 10;

interface SpeedChartProps {
  runner: RaceRunnerWithProcessedPassages & RunnerWithProcessedHours;
  race: PublicRace;
  averageSpeed: number;
}

export default function SpeedChart({ runner, race, averageSpeed }: SpeedChartProps): React.ReactElement {
  const legendColor = useChartLegendColor();
  const gridColor = useChartGridColor();

  const { width: windowWidth } = useWindowDimensions();

  const [showEachLapSpeed, setShowEachLapSpeed] = useQueryState(
    SearchParam.SHOW_LAP_SPEED,
    parseAsBoolean.withDefault(true),
  );

  const [showEachHourSpeed, setShowEachHourSpeed] = useQueryState(
    SearchParam.SHOW_HOUR_SPEED,
    parseAsBoolean.withDefault(true),
  );

  const [showAverageSpeed, setShowAverageSpeed] = useQueryState(
    SearchParam.SHOW_AVG_SPEED,
    parseAsBoolean.withDefault(true),
  );

  const [showAverageSpeedEvolution, setShowAverageSpeedEvolution] = useQueryState(
    SearchParam.SHOW_AVG_SPEED_EVOLUTION,
    parseAsBoolean.withDefault(true),
  );

  const minSpeed = React.useMemo(() => {
    const minSpeed = runner.passages.reduce<number | undefined>(
      (min, passage) => (min === undefined || passage.processed.lapSpeed < min ? passage.processed.lapSpeed : min),
      undefined,
    );

    return minSpeed ?? DEFAULT_MIN_SPEED;
  }, [runner]);

  const maxSpeed = React.useMemo(() => {
    let max = DEFAULT_MAX_SPEED;

    for (const passage of runner.passages) {
      if (passage.processed.lapSpeed > max) {
        max = passage.processed.lapSpeed;
      }
    }

    return max;
  }, [runner]);

  const data = React.useMemo<ChartData<"line">>(() => {
    const lapSpeedPoints: Array<{ x: number; y: number }> = [];
    const avgSpeedEvolutionPoints: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < runner.passages.length; i += 1) {
      const passage = runner.passages[i];

      if (i === 0) {
        avgSpeedEvolutionPoints.push({
          x: passage.processed.lapStartRaceTime,
          y: passage.processed.averageSpeedSinceRaceStart,
        });
      }

      lapSpeedPoints.push({
        x: passage.processed.lapStartRaceTime,
        y: passage.processed.lapSpeed,
      });

      avgSpeedEvolutionPoints.push({
        x: passage.processed.lapEndRaceTime,
        y: passage.processed.averageSpeedSinceRaceStart,
      });

      if (i === runner.passages.length - 1) {
        lapSpeedPoints.push({
          x: passage.processed.lapEndRaceTime,
          y: passage.processed.lapSpeed,
        });
      }
    }

    const hourSpeedPoints: Array<{ x: number; y: number | null }> = [];

    const lastPassageEndRaceTime = runner.passages.at(-1)?.processed.lapEndRaceTime;

    for (const hour of runner.hours) {
      hourSpeedPoints.push({ x: hour.startRaceTime, y: hour.averageSpeed });

      let endX = hour.endRaceTime;

      if (
        lastPassageEndRaceTime !== undefined
        && lastPassageEndRaceTime > hour.startRaceTime
        && lastPassageEndRaceTime < hour.endRaceTime
      ) {
        endX = lastPassageEndRaceTime;
      }

      hourSpeedPoints.push({ x: endX, y: hour.averageSpeed });
    }

    return {
      datasets: [
        {
          label: "Vitesse du tour",
          data: lapSpeedPoints,
          borderColor: "#ed9b3f",
          backgroundColor: "rgba(237, 155, 63, 0.3)",
          fill: true,
          stepped: "before",
          pointRadius: 0,
          borderWidth: 1,
          hidden: !showEachLapSpeed,
        },
        {
          label: "Vitesse moyenne de l'heure",
          data: hourSpeedPoints,
          borderColor: "#ff4a4f",
          backgroundColor: "rgba(255, 74, 79, 0.4)",
          fill: true,
          pointRadius: 0,
          borderWidth: 1,
          hidden: !showEachHourSpeed,
        },
        {
          label: "Vitesse moyenne générale",
          data: [
            { x: 0, y: averageSpeed },
            { x: race.duration * 1000, y: averageSpeed },
          ],
          borderColor: "#a2d083",
          backgroundColor: "#a2d083",
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
          hidden: !showAverageSpeed,
        },
        {
          label: "Vitesse moyenne générale au cours du temps",
          data: avgSpeedEvolutionPoints,
          borderColor: "#9e7eff",
          backgroundColor: "#9e7eff",
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
          hidden: !showAverageSpeedEvolution,
        },
      ],
    };
  }, [
    runner,
    averageSpeed,
    race.duration,
    showEachLapSpeed,
    showEachHourSpeed,
    showAverageSpeed,
    showAverageSpeedEvolution,
  ]);

  const options = React.useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        mode: "nearest",
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
          suggestedMin: Math.floor(minSpeed),
          suggestedMax: Math.ceil(maxSpeed),
          ticks: {
            color: legendColor,
            callback: (value) => `${value} km/h`,
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onClick: () => {},
          labels: {
            color: legendColor,
          },
        },
        tooltip: {
          enabled: true,
          filter: (_tooltipItem, index) => index === 0, // Prevent from displaying tooltip content twice when two data points have same `x` value
          callbacks: {
            title: () => [],
            label: (context) => {
              const { datasetIndex, dataIndex } = context;

              if (datasetIndex === 0 || datasetIndex === 3) {
                const passageIndex = Math.min(dataIndex, runner.passages.length - 1);
                const passage = runner.passages[passageIndex];
                const lines: string[] = [];

                if (passage.processed.lapNumber !== null) {
                  lines.push(`Tour ${passage.processed.lapNumber}`);
                  lines.push("");
                }

                lines.push(
                  `De ${formatMsAsDuration(passage.processed.lapStartRaceTime)} à ${formatMsAsDuration(passage.processed.lapEndRaceTime)} :`,
                );
                lines.push(
                  `Durée : ${formatMsAsDuration(passage.processed.lapDuration, { forceDisplayHours: false })}`,
                );
                lines.push(`Vitesse : ${passage.processed.lapSpeed.toFixed(2)} km/h`);
                lines.push(
                  `Allure : ${formatMsAsDuration(passage.processed.lapPace, { forceDisplayHours: false })}/km`,
                );
                lines.push("");
                lines.push(`De ${formatMsAsDuration(0)} à ${formatMsAsDuration(passage.processed.lapEndRaceTime)} :`);
                lines.push(`Vitesse moyenne : ${passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h`);
                lines.push(
                  `Allure moyenne : ${formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, { forceDisplayHours: false })}/km`,
                );

                return lines;
              }

              if (datasetIndex === 1) {
                const hourIndex = Math.min(Math.floor(dataIndex / 2), runner.hours.length - 1);
                const hour = runner.hours[hourIndex];

                const lastPassageEnd = runner.passages.at(-1)?.processed.lapEndRaceTime;
                const displayEndRaceTime =
                  lastPassageEnd !== undefined
                  && lastPassageEnd > hour.startRaceTime
                  && lastPassageEnd < hour.endRaceTime
                    ? lastPassageEnd
                    : hour.endRaceTime;

                return [
                  `De ${formatMsAsDuration(hour.startRaceTime)} à ${formatMsAsDuration(displayEndRaceTime)} :`,
                  `Vitesse moyenne : ${hour.averageSpeed !== null ? `${hour.averageSpeed.toFixed(2)} km/h` : "–"}`,
                  `Allure : ${hour.averagePace !== null ? `${formatMsAsDuration(hour.averagePace, { forceDisplayHours: false })}/km` : "–"}`,
                ];
              }

              if (datasetIndex === 2) {
                return `Vitesse moyenne générale : ${averageSpeed.toFixed(2)} km/h`;
              }

              return "";
            },
          },
        },
      },
    }),
    [race.duration, windowWidth, legendColor, gridColor, minSpeed, maxSpeed, runner, averageSpeed],
  );

  return (
    <Card className="flex flex-col gap-3">
      <h3>Vitesse</h3>

      <div className="grid-rows-auto grid grid-cols-6 gap-3">
        <div className="col-span-6 xl:col-span-2 2xl:col-span-1">
          <fieldset className="mb-3 flex flex-col gap-1">
            <legend className="mb-2">Éléments à afficher</legend>

            <Checkbox
              label="Vitesse à chaque tour"
              checked={showEachLapSpeed}
              onChange={() => {
                const newValue = !showEachLapSpeed;
                trackEvent(TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_LAP_SPEED, { newValue });
                void setShowEachLapSpeed(newValue);
              }}
            />

            <Checkbox
              label="Vitesse moyenne à chaque heure"
              checked={showEachHourSpeed}
              onChange={() => {
                const newValue = !showEachHourSpeed;
                trackEvent(TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_HOUR_SPEED, { newValue });
                void setShowEachHourSpeed(newValue);
              }}
            />

            <Checkbox
              label="Vitesse moyenne générale"
              checked={showAverageSpeed}
              onChange={() => {
                const newValue = !showAverageSpeed;
                trackEvent(TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_AVG_SPEED, { newValue });
                void setShowAverageSpeed(newValue);
              }}
            />

            <Checkbox
              label="Évolution de la vitesse moyenne"
              checked={showAverageSpeedEvolution}
              onChange={() => {
                const newValue = !showAverageSpeedEvolution;
                trackEvent(TrackedEvent.TOGGLE_RUNNER_SPEED_CHART_AVG_SPEED_EVOLUTION, { newValue });
                void setShowAverageSpeedEvolution(newValue);
              }}
            />
          </fieldset>
        </div>

        <div className="col-span-6 xl:col-span-4 2xl:col-span-5">
          <div style={{ minHeight: 300 }}>
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </Card>
  );
}
