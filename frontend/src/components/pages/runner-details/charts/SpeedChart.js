import CanvasJSReact from "../../../../lib/canvasjs/canvasjs.react";
import {useCallback, useMemo, useState} from "react";
import {app, RACE_DURATION} from "../../../App";
import Util from "../../../../util/Util";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const SpeedChart = ({runner, averageSpeed}) => {
    console.log(runner);

    const [displayEachLapSpeed, setDisplayEachLapSpeed] = useState(true);
    const [displayEachHourSpeed, setDisplayEachHourSpeed] = useState(true);
    const [displayAverageSpeed, setDisplayAverageSpeed] = useState(true);
    const [displayAverageSpeedEvolution, setDisplayAverageSpeedEvolution] = useState(true);

    const getXAxisLabelValue = useCallback(e => {
        return Util.formatMsAsDuration(e.value.getTime());
    }, []);

    const getTooltipContent = useCallback(e => {
        console.log(e);

        return 'toto';
    });

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
                    labelFormatter: e => null,
                },
                labelFormatter: getXAxisLabelValue,
                minimum: 0,
                maximum: RACE_DURATION,
                intervalType: "minute",
                interval: 60,
                labelAngle: -25,
            },
            axisY: {
                suffix: ' km/h',
                minimum: 0,
                maximum: 10,
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
                            x: app.state.raceStartTime,
                            y: 0,
                        },
                    ]
                },
            ]
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

        options.data[0].dataPoints = lapSpeedDataPoints;
        options.data[1].dataPoints = lapHourSpeedDataPoints;
        options.data[2].dataPoints = [
            {
                x: options.axisX.minimum,
                y: averageSpeed,
            },
            {
                x:options.axisX.maximum,
                y: averageSpeed,
            }
        ];
        options.data[3].dataPoints = averageSpeedEvolutionDataPoints;

        return options;
    }, [
        runner,
        averageSpeed,
        getXAxisLabelValue,
        getTooltipContent,
        displayEachLapSpeed,
        displayEachHourSpeed,
        displayAverageSpeed,
        displayAverageSpeedEvolution,
    ]);

    return (
        <div className="runner-details-chart-container speed-chart-container">
            <div className="row">
                <div className="col-xl-3 col-lg-12">
                    <p>Éléments à afficher</p>

                    <div className="inline-input-group">
                        <label className="input-checkbox">
                            <input type="checkbox" checked={displayEachLapSpeed} onChange={e => setDisplayEachLapSpeed(e.target.checked)} />
                            <span/>
                            Vitesse à chaque tour
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-checkbox">
                            <input type="checkbox" checked={displayEachHourSpeed} onChange={e => setDisplayEachHourSpeed(e.target.checked)} />
                            <span/>
                            Vitesse moyenne à chaque heure
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-checkbox">
                            <input type="checkbox" checked={displayAverageSpeed} onChange={e => setDisplayAverageSpeed(e.target.checked)} />
                            <span/>
                            Vitesse moyenne générale
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label className="input-checkbox">
                            <input type="checkbox" checked={displayAverageSpeedEvolution} onChange={e => setDisplayAverageSpeedEvolution(e.target.checked)} />
                            <span/>
                            Évolution de la vitesse moyenne
                        </label>
                    </div>
                </div>
                <div className="col-xl-9 col-lg-12">
                    <CanvasJSChart options={options} />
                </div>
            </div>
        </div>
    );
}

export default SpeedChart;
