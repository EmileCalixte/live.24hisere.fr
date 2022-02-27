import {useCallback, useMemo, useState} from "react";
import Util, {SORT_ASC} from "../../../util/Util";

const SORT_BY_RACE_TIME = 'raceTime';
const SORT_BY_LAP_SPEED = 'lapSpeed';

const RunnerDetailsLaps = ({runner}) => {
    const [sortColumn, setSortColumn] = useState(SORT_BY_LAP_SPEED);
    const [sortDirection, setSortDirection] = useState(SORT_ASC);

    const passagesToDisplay = useMemo(() => {
        const passagesToDisplay = [...runner.passages];

        switch (sortColumn) {
            case SORT_BY_RACE_TIME:
                passagesToDisplay.sort((passageA, passageB) => {
                    if (passageA.processed.lapEndRaceTime < passageB.processed.lapEndRaceTime) {
                        return sortDirection === SORT_ASC ? -1 : 1;
                    }

                    if (passageA.processed.lapEndRaceTime > passageB.processed.lapEndRaceTime) {
                        return sortDirection === SORT_ASC ? 1 : -1;
                    }

                    return 0;
                });
                break;
            case SORT_BY_LAP_SPEED:
                passagesToDisplay.sort((passageA, passageB) => {
                    if (passageA.processed.lapSpeed < passageB.processed.lapSpeed) {
                        return sortDirection === SORT_ASC ? -1 : 1;
                    }

                    if (passageA.processed.lapSpeed > passageB.processed.lapSpeed) {
                        return sortDirection === SORT_ASC ? 1 : -1;
                    }

                    return 0;
                });
                break;
            default:
                throw new Error('Unknown sort column');
        }

        return passagesToDisplay;
    }, [runner, sortColumn, sortDirection]);

    const updateSort = useCallback((e, clickedColumn) => {
        e.preventDefault();

        if (clickedColumn !== sortColumn) {
            setSortColumn(clickedColumn);
            setSortDirection(SORT_ASC);
            return;
        }

        setSortDirection(sortDirection * -1);
    }, [sortColumn, sortDirection, setSortColumn, setSortDirection]);

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
                            <th>
                                <a href=""
                                   onClick={e => updateSort(e, SORT_BY_RACE_TIME)}
                                >
                                    Temps de course
                                </a>
                            </th>
                            <th>Temps au tour</th>
                            <th>
                                <a href=""
                                   onClick={e => updateSort(e, SORT_BY_LAP_SPEED)}
                                >
                                    Vitesse
                                </a>
                            </th>
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
