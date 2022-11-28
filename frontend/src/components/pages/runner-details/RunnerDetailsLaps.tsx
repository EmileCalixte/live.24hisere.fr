import React, {useCallback, useMemo, useState} from "react";
import Util, {SORT_ASC} from "../../../util/Util";
import {RunnerWithProcessedPassages} from "../../../types/Runner";

enum SortBy {
    RaceTime = "raceTime",
    LapSpeed = "lapSpeed",
}

const RunnerDetailsLaps: React.FunctionComponent<{
    runner: RunnerWithProcessedPassages
}> = ({runner}) => {
    const [sortColumn, setSortColumn] = useState(SortBy.RaceTime);
    const [sortDirection, setSortDirection] = useState(SORT_ASC);

    const passagesToDisplay = useMemo(() => {
        const passagesToDisplay = [...runner.passages];

        switch (sortColumn) {
            case SortBy.RaceTime:
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
            case SortBy.LapSpeed:
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

    const updateSort = useCallback((e: React.MouseEvent<HTMLButtonElement>, clickedSortColumn: SortBy) => {
        e.preventDefault();

        if (clickedSortColumn !== sortColumn) {
            setSortColumn(clickedSortColumn);
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
                                <button className="a"
                                        onClick={e => updateSort(e, SortBy.RaceTime)}
                                >
                                    Temps de course
                                    {sortColumn === SortBy.RaceTime &&
                                    <i className={`table-column-sort-icon fa-solid fa-sort-${sortDirection === SORT_ASC ? 'down' : 'up'}`} />
                                    }
                                </button>
                            </th>
                            <th>Temps au tour</th>
                            <th>
                                <button className="a"
                                        onClick={e => updateSort(e, SortBy.LapSpeed)}
                                >
                                    Vitesse
                                    {sortColumn === SortBy.LapSpeed &&
                                    <i className={`table-column-sort-icon fa-solid fa-sort-${sortDirection === SORT_ASC ? 'down' : 'up'}`} />
                                    }
                                </button>
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
