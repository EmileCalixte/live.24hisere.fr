import React, {useCallback, useEffect, useMemo, useState} from "react";
import Util, {SORT_ASC, SORT_DESC} from "../../../util/Util";
import {RunnerWithProcessedPassages} from "../../../types/Runner";

enum SortBy {
    RaceTime = "raceTime",
    LapSpeed = "lapSpeed",
}

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

const RunnerDetailsLaps: React.FunctionComponent<{
    runner: RunnerWithProcessedPassages
}> = ({runner}) => {
    const [sortColumn, setSortColumn] = useState(SortBy.RaceTime);
    const [sortDirection, setSortDirection] = useState(SORT_ASC);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    const onResponsiveSortButtonClick = useCallback(() => {
        setSortColumn(currentSortColumn => {
            if (currentSortColumn === SortBy.RaceTime) {
                setSortDirection(SORT_DESC);
                return SortBy.LapSpeed;
            }

            setSortDirection(SORT_ASC);
            return SortBy.RaceTime;
        });
    }, []);

    useEffect(() => {
        const onResize = (e: UIEvent) => {
            setWindowWidth((e.target as Window).innerWidth);
        }

        window.addEventListener("resize", onResize);

        return (() => {
            window.removeEventListener("resize", onResize);
        })
    }, []);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Détails des tours</h2>

                {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH &&
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
                }

                {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH &&
                <div>
                    <div className="mb-3">
                        <button className="button" onClick={onResponsiveSortButtonClick}>
                            {sortColumn === SortBy.RaceTime &&
                            <>Trier par vitesse</>
                            }

                            {sortColumn === SortBy.LapSpeed &&
                            <>Trier par temps de passage</>
                            }
                        </button>
                    </div>

                    <table id="runner-laps-table" className="table responsive-runner-laps-table">
                        <tbody>
                        {passagesToDisplay.map((passage, index) => (
                            <tr key={index}>
                                <td>
                                    <div>
                                        <strong>
                                            {passage.processed.lapNumber === null &&
                                                <>Premier passage</>
                                            }

                                            {passage.processed.lapNumber !== null &&
                                                <>Tour {passage.processed.lapNumber}</>
                                            }
                                        </strong>

                                        &nbsp;–&nbsp;

                                        {Util.formatMsAsDuration(passage.processed.lapEndRaceTime)}
                                    </div>

                                    <div className="responsive-runner-laps-table-row-secondary-data">
                                        Durée&nbsp;:&nbsp;{Util.formatMsAsDuration(passage.processed.lapDuration)}
                                        <> </>|<> </>
                                        {passage.processed.lapSpeed.toFixed(2)} km/h
                                        <> </>|<> </>
                                        {Util.formatMsAsDuration(passage.processed.lapPace, false)}/km
                                    </div>

                                    <div className="responsive-runner-laps-table-row-secondary-data">
                                        Depuis départ&nbsp;:&nbsp; {passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h
                                        <> </>|<> </>
                                        {Util.formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, false)}/km
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                }

            </div>
        </div>
    )
}

export default RunnerDetailsLaps;
