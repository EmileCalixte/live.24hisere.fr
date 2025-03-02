/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access  */
import React from "react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Col, Row } from "react-bootstrap";
import ReactDOMServer from "react-dom/server";
import type { PublicRace, RaceRunnerWithProcessedPassages, RunnerWithProcessedHours } from "@live24hisere/core/types";
import { SearchParam } from "../../../../constants/searchParams";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import CanvasjsReact from "../../../../lib/canvasjs/canvasjs.react";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { Card } from "../../../ui/Card";
import { Checkbox } from "../../../ui/forms/Checkbox";

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

const DEFAULT_MIN_SPEED = 0;
const DEFAULT_MAX_SPEED = 10;

function getBaseXAxisInterval(raceDuration: number): number {
  if (raceDuration <= 14400) {
    // up to 4h
    return Math.ceil(raceDuration / 60 / 24 / 10) * 10;
  }

  if (raceDuration <= 21600) {
    // up to 6h
    return Math.ceil(raceDuration / 60 / 24 / 15) * 15;
  }

  if (raceDuration <= 28800) {
    // up to 8h
    return Math.ceil(raceDuration / 60 / 24 / 20) * 20;
  }

  if (raceDuration <= 43200) {
    // up to 12h
    return Math.ceil(raceDuration / 60 / 24 / 30) * 30;
  }

  return Math.ceil(raceDuration / 60 / 24 / 60) * 60;
}

function getXAxisLabelValue(e: any): string {
  return formatMsAsDuration(e.value.getTime());
}

interface SpeedChartProps {
  runner: RaceRunnerWithProcessedPassages & RunnerWithProcessedHours;
  race: PublicRace;
  averageSpeed: number;
}

export default function SpeedChart({ runner, race, averageSpeed }: SpeedChartProps): React.ReactElement {
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

  const getXAxisInterval = React.useCallback((): number => {
    const baseInterval = getBaseXAxisInterval(race.duration);

    if (windowWidth < 640) {
      return baseInterval * 4;
    }

    if (windowWidth < 968) {
      return baseInterval * 2;
    }

    return baseInterval;
  }, [race.duration, windowWidth]);

  const getTooltipContent = React.useCallback(
    (e: any) => {
      // const dataPoint = e.entries[0].dataPoint;
      const dataSeriesIndex = e.entries[0].dataSeries.index;

      if (dataSeriesIndex === 0 || dataSeriesIndex === 3) {
        const passageIndex = Math.min(e.entries[0].index, runner.passages.length - 1);

        const passage = runner.passages[passageIndex];

        return ReactDOMServer.renderToString(
          <div>
            {passage.processed.lapNumber !== null && (
              <div style={{ marginBottom: "0.75em" }}>Tour {passage.processed.lapNumber}</div>
            )}

            <div>
              De <strong>{formatMsAsDuration(passage.processed.lapStartRaceTime)}</strong> à{" "}
              <strong>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</strong> :
            </div>

            <div>
              Durée : <strong>{formatMsAsDuration(passage.processed.lapDuration, { forceDisplayHours: false })}</strong>
            </div>

            <div>
              Vitesse : <strong>{passage.processed.lapSpeed.toFixed(2)} km/h</strong>
            </div>

            <div>
              Allure :{" "}
              <strong>
                {formatMsAsDuration(passage.processed.lapPace, { forceDisplayHours: false })}
                /km
              </strong>
            </div>

            <div style={{ marginTop: "0.75em" }}>
              De <strong>{formatMsAsDuration(0)}</strong> à{" "}
              <strong>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</strong> :
            </div>

            <div>
              Vitesse moyenne : <strong>{passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h</strong>
            </div>

            <div>
              Allure moyenne :{" "}
              <strong>
                {formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, { forceDisplayHours: false })}
                /km
              </strong>
            </div>
          </div>,
        );
      }

      if (dataSeriesIndex === 1) {
        const hourIndex = Math.min(Math.floor(e.entries[0].index / 2), runner.hours.length - 1);
        const hour = runner.hours[hourIndex];

        return ReactDOMServer.renderToString(
          <div>
            <div>
              De <strong>{formatMsAsDuration(hour.startRaceTime)}</strong> à{" "}
              <strong>{formatMsAsDuration(hour.endRaceTime)}</strong> :
            </div>
            <div>
              Vitesse moyenne :{" "}
              <strong>{hour.averageSpeed !== null ? hour.averageSpeed.toFixed(2) + " km/h" : "–"}</strong>
            </div>
            <div>
              Allure :{" "}
              <strong>
                {hour.averagePace !== null
                  ? formatMsAsDuration(hour.averagePace, { forceDisplayHours: false }) + "/km"
                  : "–"}
              </strong>
            </div>
          </div>,
        );
      }

      if (dataSeriesIndex === 2) {
        return ReactDOMServer.renderToString(
          <div>
            Vitesse moyenne générale : <strong>{averageSpeed.toFixed(2)} km/h</strong>
          </div>,
        );
      }

      return null;
    },
    [averageSpeed, runner],
  );

  const minSpeed = React.useMemo(() => {
    const minSpeed = runner.passages.reduce<number | undefined>(
      (min, passage) => (min === undefined || passage.processed.lapSpeed < min ? passage.processed.lapSpeed : min),
      undefined,
    );

    return minSpeed ?? DEFAULT_MIN_SPEED;
  }, [runner]);

  const maxSpeed = React.useMemo(() => {
    const maxSpeed = runner.passages.reduce<number | undefined>(
      (max, passage) => (max === undefined || passage.processed.lapSpeed > max ? passage.processed.lapSpeed : max),
      undefined,
    );

    return maxSpeed ?? DEFAULT_MAX_SPEED;
  }, [runner]);

  const options = React.useMemo(() => {
    const options = {
      theme: "light2",
      animationEnabled: false,
      // animationDuration: 200,
      toolTip: {
        enabled: true,
        contentFormatter: getTooltipContent,
      },
      axisX: {
        crosshair: {
          enabled: true,
          labelFormatter: () => null,
        },
        labelFormatter: getXAxisLabelValue,
        minimum: 0,
        maximum: race.duration * 1000,
        intervalType: "minute",
        interval: getXAxisInterval(),
        labelAngle: -25,
      },
      axisY: {
        suffix: " km/h",
        minimum: Math.floor(minSpeed),
        maximum: Math.ceil(maxSpeed),
      },
      data: [
        {
          type: "stepArea",
          markerType: null,
          showInLegend: true,
          name: "Vitesse du tour",
          visible: showEachLapSpeed,
          color: "#ed9b3f",
          dataPoints: [],
        },
        {
          type: "stepArea",
          markerType: null,
          showInLegend: true,
          name: "Vitesse moyenne de l'heure",
          visible: showEachHourSpeed,
          color: "#ff4a4f",
          fillOpacity: 0.4,
          dataPoints: [],
        },
        {
          type: "line",
          markerType: null,
          showInLegend: true,
          name: "Vitesse moyenne générale",
          visible: showAverageSpeed,
          color: "#a2d083",
          fillOpacity: 0,
          dataPoints: [],
        },
        {
          type: "line",
          markerType: null,
          showInLegend: true,
          name: "Vitesse moyenne générale au cours du temps",
          visible: showAverageSpeedEvolution,
          color: "#9e7eff",
          fillOpacity: 0,
          legendMarkerType: "square",
          dataPoints: [],
        },
        {
          // Necessary to avoid an infinite loop of CanvasJS
          type: "line",
          markerType: null,
          showInLegend: false,
          name: "Antifreeze",
          dataPoints: [
            {
              x: new Date(race.startTime),
              y: 0,
            },
          ],
        },
      ],
    };

    const lapSpeedDataPoints = [];
    const averageSpeedEvolutionDataPoints = [];

    for (let i = 0; i < runner.passages.length; ++i) {
      const passage = runner.passages[i];

      // Ensure that the max value of the speed axis is always higher than the runner max speed
      if (passage.processed.lapSpeed > options.axisY.maximum) {
        options.axisY.maximum = Math.ceil(passage.processed.lapSpeed);
      }

      if (i === 0) {
        averageSpeedEvolutionDataPoints.push({
          x: passage.processed.lapStartRaceTime,
          y: passage.processed.averageSpeedSinceRaceStart,
        });
      }

      lapSpeedDataPoints.push({
        x: passage.processed.lapStartRaceTime,
        y: passage.processed.lapSpeed,
      });

      averageSpeedEvolutionDataPoints.push({
        x: passage.processed.lapEndRaceTime,
        y: passage.processed.averageSpeedSinceRaceStart,
      });

      if (i === runner.passages.length - 1) {
        lapSpeedDataPoints.push({
          x: passage.processed.lapEndRaceTime,
          y: passage.processed.lapSpeed,
        });
      }
    }

    const lapHourSpeedDataPoints = [];

    for (const hour of runner.hours) {
      lapHourSpeedDataPoints.push({
        x: hour.startRaceTime,
        y: hour.averageSpeed,
      });

      lapHourSpeedDataPoints.push({
        x: hour.endRaceTime,
        y: hour.averageSpeed,
      });
    }

    options.data[0].dataPoints = lapSpeedDataPoints as any;
    options.data[1].dataPoints = lapHourSpeedDataPoints as any;
    options.data[2].dataPoints = [
      {
        // @ts-ignore
        x: options.axisX.minimum,
        y: averageSpeed,
      },
      {
        // @ts-ignore
        x: options.axisX.maximum,
        y: averageSpeed,
      },
    ];
    options.data[3].dataPoints = averageSpeedEvolutionDataPoints as any;

    return options;
  }, [
    runner,
    race,
    averageSpeed,
    minSpeed,
    maxSpeed,
    getXAxisInterval,
    getTooltipContent,
    showEachLapSpeed,
    showEachHourSpeed,
    showAverageSpeed,
    showAverageSpeedEvolution,
  ]);

  return (
    <Card>
      <Row>
        <Col xs={12}>
          <h3 className="mt-0">Vitesse</h3>
        </Col>

        <Col xxl={2} xl={3} lg={12}>
          <fieldset className="mb-3">
            <legend className="mb-2">Éléments à afficher</legend>

            <Checkbox
              label="Vitesse à chaque tour"
              checked={showEachLapSpeed}
              onChange={() => {
                void setShowEachLapSpeed(!showEachLapSpeed);
              }}
            />

            <Checkbox
              label="Vitesse moyenne à chaque heure"
              className="mt-2"
              checked={showEachHourSpeed}
              onChange={() => {
                void setShowEachHourSpeed(!showEachHourSpeed);
              }}
            />

            <Checkbox
              label="Vitesse moyenne générale"
              className="mt-2"
              checked={showAverageSpeed}
              onChange={() => {
                void setShowAverageSpeed(!showAverageSpeed);
              }}
            />

            <Checkbox
              label="Évolution de la vitesse moyenne"
              className="mt-2"
              checked={showAverageSpeedEvolution}
              onChange={() => {
                void setShowAverageSpeedEvolution(!showAverageSpeedEvolution);
              }}
            />
          </fieldset>
        </Col>
        <Col xxl={10} xl={9} lg={12}>
          <CanvasJSChart options={options} />
        </Col>
      </Row>
    </Card>
  );
}
