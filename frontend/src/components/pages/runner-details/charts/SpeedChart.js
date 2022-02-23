import CanvasJSReact from "../../../../lib/canvasjs/canvasjs.react";
import {useMemo} from "react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const SpeedChart = ({runner}) => {
    console.log(runner);

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
                    Options
                </div>
                <div className="col-xl-9 col-lg-12">
                    <CanvasJSChart options={options} />
                </div>
            </div>
        </div>
    );
}

export default SpeedChart;
