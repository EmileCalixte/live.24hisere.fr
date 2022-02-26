import CanvasJSReact from "../../../../lib/canvasjs/canvasjs.react";
import { useMemo, useState} from "react";
import {app, RACE_DURATION} from "../../../App";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const SpeedChart = ({runner}) => {
    console.log(runner);

    const [displayEachLapSpeed, setDisplayEachLapSpeed] = useState(true);
    const [displayEachHourSpeed, setDisplayEachHourSpeed] = useState(true);
    const [displayAverageSpeed, setDisplayAverageSpeed] = useState(true);
    const [displayAverageSpeedEvolution, setDisplayAverageSpeedEvolution] = useState(true);

    const options = useMemo(() => {
        const options = {
            theme: "light2",
            animationEnabled: false,
            // animationDuration: 200,
            toolTip: {
                enabled: true,
                contentFormatter: e => '<strong>TODO</strong> real data',
            },
            axisX: {
                crosshair: {
                    enabled: true,
                    labelFormatter: e => null,
                },
                labelFormatter: e => e.value, // TODO format
                minimum: app.state.raceStartTime,
                maximum: new Date(app.state.raceStartTime.getTime() + RACE_DURATION),
                intervalType: "minute",
                interval: 60,
                labelAngle: -20,
            },
            axisY: {
                suffix: ' km/h',
                minimum: 0,
                // maximum: 20,
            },
            data: [
                {
                    type: "stepArea",
                    markerType: null,
                    showInLegend: true,
                    name: "Vitesse du tour",
                    color: "#ed9b3f",
                    dataPoints: [],
                },
                {
                    type: "stepArea",
                    markerType: null,
                    showInLegend: true,
                    name: "Vitesse moyenne de l'heure",
                    color: "#ff4a4f",
                    fillOpacity: 0.4,
                    dataPoints: [],
                },
                {
                    type: "line",
                    markerType: null,
                    showInLegend: true,
                    name: "Vitesse moyenne générale",
                    color: "#a2d083",
                    fillOpacity: 0,
                    dataPoints: [],
                },
                {
                    type: "line",
                    markerType: null,
                    showInLegend: true,
                    name: "Vitesse moyenne générale au cours du temps",
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

        for (let i = 0; i < runner.passages.length; ++i) {
            const passage = runner.passages[i];

            lapSpeedDataPoints.push({
                x: passage.processed.lapStartTime,
                y: passage.processed.lapSpeed,
            });

            if (i === runner.passages.length - 1) {
                lapSpeedDataPoints.push({
                    x: passage.processed.lapEndTime,
                    y: passage.processed.lapSpeed,
                });
            }
        }

        const lapHourSpeedDataPoints = [];

        for (let i = 0; i < runner.hours.length; ++i) {
            const hour = runner.hours[i];

            lapHourSpeedDataPoints.push({
                x: hour.startTime,
                y: hour.averageSpeed,
            });

            lapHourSpeedDataPoints.push({
                x: hour.endTime,
                y: hour.averageSpeed,
            });
        }

        options.data[0].dataPoints = lapSpeedDataPoints;
        options.data[1].dataPoints = lapHourSpeedDataPoints;

        return options;
    }, [runner]);

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
