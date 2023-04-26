import {faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {getRaceTime, isRaceFinished, isRaceStarted} from "../../../helpers/raceHelper";
import {formatMsAsDuration, SORT_ASC, SORT_DESC} from "../../../util/utils";
import {appDataContext} from "../../App";

enum SortBy {
    RaceTime = "raceTime",
    LapSpeed = "lapSpeed",
}

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

interface RunnerDetailsLapsProps {
    runner: RunnerWithRace & RunnerWithProcessedPassages;
}

export default function RunnerDetailsLaps({runner}: RunnerDetailsLapsProps) {
    const {serverTimeOffset} = useContext(appDataContext);

    const race = runner.race;

    const [raceTime, setRaceTime] = useState(getRaceTime(race, serverTimeOffset));

    const [sortColumn, setSortColumn] = useState(SortBy.RaceTime);
    const [sortDirection, setSortDirection] = useState(SORT_ASC);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const currentLapTime = useMemo(() => {
        if (runner.passages.length === 0) {
            return raceTime;
        }

        const lastPassage = runner.passages[runner.passages.length - 1];

        return raceTime - lastPassage.processed.lapEndRaceTime;
    }, [raceTime, runner]);

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
                throw new Error("Unknown sort column");
        }

        return passagesToDisplay;
    }, [runner, sortColumn, sortDirection]);

    const currentLapTableRow = useMemo(() => {
        if (currentLapTime === null) {
            return null;
        }

        return (
            <tr>
                <td colSpan={2}>Tour en cours</td>
                <td>{formatMsAsDuration(raceTime)}</td>
                <td>{formatMsAsDuration(currentLapTime)}</td>
                <td colSpan={42}/>
            </tr>
        );
    }, [raceTime, currentLapTime]);

    const currentLapResponsiveTableRow = useMemo(() => {
        if (currentLapTime === null) {
            return null;
        }

        return (
            <tr>
                <td>
                    <div>
                        <strong>Tour en cours</strong>

                        &nbsp;–&nbsp;

                        {formatMsAsDuration(raceTime)}
                    </div>

                    <div className="responsive-runner-laps-table-row-secondary-data">
                        Durée&nbsp;:&nbsp;
                        <strong>{formatMsAsDuration(currentLapTime)}</strong>
                    </div>
                </td>
            </tr>
        );
    }, [raceTime, currentLapTime]);

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
        const interval = setInterval(() => setRaceTime(getRaceTime(race, serverTimeOffset)));

        return () => clearInterval(interval);
    }, [race, serverTimeOffset]);

    useEffect(() => {
        const onResize = (e: UIEvent) => {
            setWindowWidth((e.target as Window).innerWidth);
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    const showCurrentLap = isRaceStarted(race, serverTimeOffset) && !isRaceFinished(race, serverTimeOffset) && sortColumn === SortBy.RaceTime;

    const showCurrentLapAtTopOfTable = showCurrentLap && sortDirection === SORT_DESC;
    const showCurrentLapAtBottomOfTable = showCurrentLap && sortDirection === SORT_ASC;

    return (
        <Row>
            <Col>
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
                                                <>
                                                    {sortDirection === SORT_ASC &&
                                                        <FontAwesomeIcon icon={faSortDown} className="ms-1" />
                                                    }
                                                    {sortDirection === SORT_DESC &&
                                                        <FontAwesomeIcon icon={faSortUp} className="ms-1" />
                                                    }
                                                </>
                                            }
                                        </button>
                                    </th>
                                    <th>Temps au tour</th>
                                    <th>
                                        <button className="a"
                                                onClick={e => { updateSort(e, SortBy.LapSpeed); }}
                                        >
                                            Vitesse
                                            {sortColumn === SortBy.LapSpeed &&
                                                <>
                                                    {sortDirection === SORT_ASC &&
                                                        <FontAwesomeIcon icon={faSortDown} className="ms-1" />
                                                    }
                                                    {sortDirection === SORT_DESC &&
                                                        <FontAwesomeIcon icon={faSortUp} className="ms-1" />
                                                    }
                                                </>
                                            }
                                        </button>
                                    </th>
                                    <th>Allure</th>
                                    <th>Vmoy. depuis le début</th>
                                    <th>Allure depuis le début</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showCurrentLapAtTopOfTable &&
                                    <>{currentLapTableRow}</>
                                }
                                {passagesToDisplay.map((passage, index) => (
                                    <tr key={index}>
                                        <td>
                                            {passage.processed.lapNumber !== null ? passage.processed.lapNumber : "–"}
                                        </td>
                                        <td>
                                            {(passage.processed.totalDistance / 1000).toFixed(2)} km
                                        </td>
                                        <td>
                                            {formatMsAsDuration(passage.processed.lapEndRaceTime)}
                                        </td>
                                        <td>
                                            {formatMsAsDuration(passage.processed.lapDuration)}
                                        </td>
                                        <td>
                                            {passage.processed.lapSpeed.toFixed(2)} km/h
                                        </td>
                                        <td>
                                            {formatMsAsDuration(passage.processed.lapPace, false)}/km
                                        </td>
                                        <td>
                                            {passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h
                                        </td>
                                        <td>
                                            {formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, false)}/km
                                        </td>
                                    </tr>
                                ))}
                                {showCurrentLapAtBottomOfTable &&
                                    <>{currentLapTableRow}</>
                                }
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
                                {showCurrentLapAtTopOfTable &&
                                    <>{currentLapResponsiveTableRow}</>
                                }
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

                                                {formatMsAsDuration(passage.processed.lapEndRaceTime)}
                                            </div>

                                            <div className="responsive-runner-laps-table-row-secondary-data">
                                                Durée&nbsp;:&nbsp;
                                                <strong>{formatMsAsDuration(passage.processed.lapDuration)}</strong>
                                                <> </>
                                                |<> </>
                                                <strong>{passage.processed.lapSpeed.toFixed(2)} km/h</strong>
                                                <> </>
                                                |<> </>
                                                {formatMsAsDuration(passage.processed.lapPace, false)}/km
                                            </div>

                                            <div className="responsive-runner-laps-table-row-secondary-data">
                                                Depuis
                                                départ&nbsp;:&nbsp; {passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h
                                                <> </>|<> </>
                                                {formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, false)}/km
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {showCurrentLapAtBottomOfTable &&
                                    <>{currentLapResponsiveTableRow}</>
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </Col>
        </Row>
    );
}
