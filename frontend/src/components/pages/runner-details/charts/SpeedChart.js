import CanvasJSReact from "../../../../lib/canvasjs/canvasjs.react";
import {useMemo, useState} from "react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const SpeedChart = ({runner}) => {
    console.log(runner);

    const [displayEachLapSpeed, setDisplayEachLapSpeed] = useState(true);
    const [displayEachHourSpeed, setDisplayEachHourSpeed] = useState(true);
    const [displayAverageSpeed, setDisplayAverageSpeed] = useState(true);
    const [displayAverageSpeedEvolution, setDisplayAverageSpeedEvolution] = useState(true);

    const options = useMemo(() => {
        return {
            title: {
                text: "Basic Column Chart in React"
            },
            data: [{
                type: "column",
                dataPoints: [
                    {label: "Apple", y: runner.id * 2},
                    {label: "Orange", y: 15},
                    {label: "Banana", y: 25},
                    {label: "Mango", y: 30},
                    {label: "Grape", y: 28}
                ]
            }]
        };
    }, [runner]);

    return (
        <div className="runner-details-chart-container speed-chart-container">
            <div className="row">
                <div className="col-xl-3 col-lg-12">
                    <p>Éléments à afficher</p>

                    <div className="inline-input-group">
                        <label>
                            <input type="checkbox" checked={displayEachLapSpeed} onChange={e => setDisplayEachLapSpeed(e.target.checked)} />
                            <span/>
                            Vitesse à chaque tour
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label>
                            <input type="checkbox" checked={displayEachHourSpeed} onChange={e => setDisplayEachHourSpeed(e.target.checked)} />
                            <span/>
                            Vitesse moyenne à chaque heure
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label>
                            <input type="checkbox" checked={displayAverageSpeed} onChange={e => setDisplayAverageSpeed(e.target.checked)} />
                            <span/>
                            Vitesse moyenne générale
                        </label>
                    </div>

                    <div className="inline-input-group">
                        <label>
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
