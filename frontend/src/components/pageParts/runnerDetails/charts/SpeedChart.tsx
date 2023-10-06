import { Col, Row } from "react-bootstrap";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import CanvasJSReact from "../../../../lib/canvasjs/canvasjs.react";
import React, { useCallback, useMemo, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { type Race } from "../../../../types/Race";
import { type RunnerWithProcessedHours, type RunnerWithProcessedPassages } from "../../../../types/Runner";
import { formatMsAsDuration } from "../../../../util/utils";
import { Checkbox } from "../../../ui/forms/Checkbox";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DEFAULT_MIN_SPEED = 0;
const DEFAULT_MAX_SPEED = 10;

function getBaseXAxisInterval(raceDuration: number): number {
    if (raceDuration <= 14400) { // up to 4h
        return Math.ceil(raceDuration / 60 / 24 / 10) * 10;
    }

    if (raceDuration <= 21600) { // up to 6h
        return Math.ceil(raceDuration / 60 / 24 / 15) * 15;
    }

    if (raceDuration <= 28800) { // up to 8h
        return Math.ceil(raceDuration / 60 / 24 / 20) * 20;
    }

    if (raceDuration <= 43200) { // up to 12h
        return Math.ceil(raceDuration / 60 / 24 / 30) * 30;
    }

    return Math.ceil(raceDuration / 60 / 24 / 60) * 60;
}

interface SpeedChartProps {
    runner: RunnerWithProcessedPassages & RunnerWithProcessedHours;
    race: Race;
    averageSpeed: number;
}

export default function SpeedChart({ runner, race, averageSpeed }: SpeedChartProps): React.ReactElement {
    const [displayEachLapSpeed, setDisplayEachLapSpeed] = useState(true);
    const [displayEachHourSpeed, setDisplayEachHourSpeed] = useState(true);
    const [displayAverageSpeed, setDisplayAverageSpeed] = useState(true);
    const [displayAverageSpeedEvolution, setDisplayAverageSpeedEvolution] = useState(true);

    const { width: windowWidth } = useWindowDimensions();

    const getXAxisInterval = useCallback((): number => {
        const baseInterval = getBaseXAxisInterval(race.duration);

        if (windowWidth < 640) {
            return baseInterval * 4;
        }

        if (windowWidth < 968) {
            return baseInterval * 2;
        }

        return baseInterval;
    }, [race.duration, windowWidth]);

    const getXAxisLabelValue = useCallback((e: any) => {
        return formatMsAsDuration(e.value.getTime());
    }, []);

    const getTooltipContent = useCallback((e: any) => {
        // const dataPoint = e.entries[0].dataPoint;
        const dataSeriesIndex = e.entries[0].dataSeries.index;

        if (dataSeriesIndex === 0 || dataSeriesIndex === 3) {
            const passageIndex = Math.min(e.entries[0].index, runner.passages.length - 1);

            const passage = runner.passages[passageIndex];

            return ReactDOMServer.renderToString(
                <div>
                    {passage.processed.lapNumber !== null &&
                        <div style={{ marginBottom: "0.75em" }}>Tour {passage.processed.lapNumber}</div>
                    }

                    <div>
                        De <strong>{formatMsAsDuration(passage.processed.lapStartRaceTime)}</strong> à <strong>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</strong> :
                    </div>

                    <div>
                        Durée : <strong>{formatMsAsDuration(passage.processed.lapDuration, false)}</strong>
                    </div>

                    <div>
                        Vitesse : <strong>{passage.processed.lapSpeed.toFixed(2)} km/h</strong>
                    </div>

                    <div>
                        Allure : <strong>{formatMsAsDuration(passage.processed.lapPace, false)}/km</strong>
                    </div>

                    <div style={{ marginTop: "0.75em" }}>
                        De <strong>{formatMsAsDuration(0)}</strong> à <strong>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</strong> :
                    </div>

                    <div>
                        Vitesse moyenne : <strong>{passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h</strong>
                    </div>

                    <div>
                        Allure moyenne : <strong>{formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, false)}/km</strong>
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
                        De <strong>{formatMsAsDuration(hour.startRaceTime)}</strong> à <strong>{formatMsAsDuration(hour.endRaceTime)}</strong> :
                    </div>
                    <div>
                        Vitesse moyenne : <strong>{hour.averageSpeed !== null ? hour.averageSpeed.toFixed(2) + " km/h" : "–"}</strong>
                    </div>
                    <div>
                        Allure : <strong>{hour.averagePace !== null ? formatMsAsDuration(hour.averagePace, false) + "/km" : "–"}</strong>
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
    }, [averageSpeed, runner]);

    const minSpeed = useMemo(() => {
        let minSpeed: number | undefined;

        runner.passages.forEach(passage => {
            if (minSpeed === undefined || passage.processed.lapSpeed < minSpeed) {
                minSpeed = passage.processed.lapSpeed;
            }
        });

        return minSpeed ?? DEFAULT_MIN_SPEED;
    }, [runner]);

    const maxSpeed = useMemo(() => {
        let maxSpeed: number | undefined;

        runner.passages.forEach(passage => {
            if (maxSpeed === undefined || passage.processed.lapSpeed > maxSpeed) {
                maxSpeed = passage.processed.lapSpeed;
            }
        });

        return maxSpeed ?? DEFAULT_MAX_SPEED;
    }, [runner]);

    const options = useMemo(() => {
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
                    visible: displayEachLapSpeed,
                    color: "#ed9b3f",
                    dataPoints: [],
                },
                {
                    type: "stepArea",
                    markerType: null,
                    showInLegend: true,
                    name: "Vitesse moyenne de l'heure",
                    visible: displayEachHourSpeed,
                    color: "#ff4a4f",
                    fillOpacity: 0.4,
                    dataPoints: [],
                },
                {
                    type: "line",
                    markerType: null,
                    showInLegend: true,
                    name: "Vitesse moyenne générale",
                    visible: displayAverageSpeed,
                    color: "#a2d083",
                    fillOpacity: 0,
                    dataPoints: [],
                },
                {
                    type: "line",
                    markerType: null,
                    showInLegend: true,
                    name: "Vitesse moyenne générale au cours du temps",
                    visible: displayAverageSpeedEvolution,
                    color: "#9e7eff",
                    fillOpacity: 0,
                    legendMarkerType: "square",
                    dataPoints: [],
                },
                { // Necessary to avoid an infinite loop of CanvasJS
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

        for (let i = 0; i < runner.hours.length; ++i) {
            const hour = runner.hours[i];

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
        getXAxisLabelValue,
        getTooltipContent,
        displayEachLapSpeed,
        displayEachHourSpeed,
        displayAverageSpeed,
        displayAverageSpeedEvolution,
    ]);

    return (
        <div className="runner-details-chart-container speed-chart-container">
            <Row>
                <Col xxl={2} xl={3} lg={12}>
                    <fieldset className="mb-3">
                        <legend className="mb-2">Éléments à afficher</legend>

                        <Checkbox label="Vitesse à chaque tour"
                                  checked={displayEachLapSpeed}
                                  onChange={e => { setDisplayEachLapSpeed(e.target.checked); }}
                        />

                        <Checkbox label="Vitesse moyenne à chaque heure"
                                  className="mt-2"
                                  checked={displayEachHourSpeed}
                                  onChange={e => { setDisplayEachHourSpeed(e.target.checked); }}
                        />

                        <Checkbox label="Vitesse moyenne générale"
                                  className="mt-2"
                                  checked={displayAverageSpeed}
                                  onChange={e => { setDisplayAverageSpeed(e.target.checked); }}
                        />

                        <Checkbox label="Évolution de la vitesse moyenne"
                                  className="mt-2"
                                  checked={displayAverageSpeedEvolution}
                                  onChange={e => { setDisplayAverageSpeedEvolution(e.target.checked); }}
                        />
                    </fieldset>
                </Col>
                <Col xxl={10} xl={9} lg={12}>
                    <CanvasJSChart options={options} />
                </Col>
            </Row>
        </div>
    );
}
