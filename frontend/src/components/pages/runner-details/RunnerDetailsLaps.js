import {useMemo} from "react";
import Util from "../../../util/Util";

const RunnerDetailsLaps = ({runner}) => {
    const passagesToDisplay = useMemo(() => {
        const passagesToDisplay = [...runner.passages];

        return passagesToDisplay;
    }, [runner]);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Détails des tours</h2>

                <div style={{maxWidth: 1400}}>
                    <table id="runner-laps-table" className="table">
                        <thead>
                        <tr>
                            <th>Nb. tours</th>
                            <th>Distance</th>
                            <th>Temps de course</th>
                            <th>Temps au tour</th>
                            <th>Vitesse</th>
                            <th>Allure</th>
                            <th>Vmoy. depuis le début</th>
                            <th>Allure depuis le début</th>
                        </tr>
                        </thead>
                        <tbody>
                        {passagesToDisplay.map((passage, index) => (
                            <tr key={index}>
                                <td>
                                    {passage.processed.lapNumber !== null ? passage.processed.lapNumber : '–'}
                                </td>
                                <td>
                                    {(passage.processed.totalDistance / 1000).toFixed(2)} km
                                </td>
                                <td>
                                    {Util.formatMsAsDuration(passage.processed.lapEndRaceTime)}
                                </td>
                                <td>
                                    {Util.formatMsAsDuration(passage.processed.lapDuration)}
                                </td>
                                <td>
                                    {passage.processed.lapSpeed.toFixed(2)} km/h
                                </td>
                                <td>
                                    {Util.formatMsAsDuration(passage.processed.lapPace, false)}/km
                                </td>
                                <td>
                                    {passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h
                                </td>
                                <td>
                                    {Util.formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, false)}/km
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default RunnerDetailsLaps;
