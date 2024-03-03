import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { SearchParam } from "../../../constants/searchParams";
import { useQueryString } from "../../../hooks/queryString/useQueryString";
import { useRaceTime } from "../../../hooks/useRaceTime";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { type Race } from "../../../types/Race";
import { type MinimalRankingRunnerInput, type RankingRunner } from "../../../types/Ranking";
import { type RunnerWithProcessedPassages } from "../../../types/Runner";
import { SortDirection } from "../../../constants/sort";
import { inArray } from "../../../utils/arrayUtils";
import { isRaceFinished, isRaceStarted } from "../../../utils/raceUtils";
import { getOppositeSortDirection } from "../../../utils/sortUtils";
import { formatMsAsDuration } from "../../../utils/utils";
import { appDataContext } from "../../App";

const enum SortBy {
    RACE_TIME = "raceTime",
    LAP_SPEED = "lapSpeed",
}

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

interface RunnerDetailsLapsProps {
    runner: RankingRunner<MinimalRankingRunnerInput & RunnerWithProcessedPassages>;
    race: Race;
}

function isValidSortColumn(sortColumn: string | null): sortColumn is SortBy {
    return inArray(sortColumn, [SortBy.RACE_TIME, SortBy.LAP_SPEED]);
}

function isValidSortDirection(sortDirection: string | null): sortDirection is SortDirection {
    return inArray(sortDirection, [SortDirection.ASC, SortDirection.DESC]);
}

export default function RunnerDetailsLaps({ runner, race }: RunnerDetailsLapsProps): React.ReactElement {
    const { serverTimeOffset } = React.useContext(appDataContext);

    const { searchParams, setParams } = useQueryString();

    const searchParamsSortColumn = searchParams.get(SearchParam.SORT_COLUMN);
    const searchParamsDirection = searchParams.get(SearchParam.SORT_DIRECTION);

    React.useEffect(() => {
        const newParams: Record<string, string> = {};

        if (!isValidSortColumn(searchParamsSortColumn)) {
            newParams[SearchParam.SORT_COLUMN] = SortBy.RACE_TIME;
        }

        if (!isValidSortDirection(searchParamsDirection)) {
            newParams[SearchParam.SORT_DIRECTION] = SortDirection.ASC;
        }

        setParams(newParams);
    }, [searchParamsDirection, searchParamsSortColumn, setParams]);

    const sortColumn = React.useMemo<SortBy>(() => {
        return isValidSortColumn(searchParamsSortColumn) ? searchParamsSortColumn : SortBy.RACE_TIME;
    }, [searchParamsSortColumn]);

    const sortDirection = React.useMemo<SortDirection>(() => {
        return isValidSortDirection(searchParamsDirection) ? searchParamsDirection : SortDirection.ASC;
    }, [searchParamsDirection]);

    const raceTime = useRaceTime(race, serverTimeOffset);

    const { width: windowWidth } = useWindowDimensions();

    const currentLapTime = React.useMemo(() => {
        if (runner.passages.length === 0) {
            return raceTime;
        }

        const lastPassage = runner.passages[runner.passages.length - 1];

        return raceTime - lastPassage.processed.lapEndRaceTime;
    }, [raceTime, runner]);

    const passagesToDisplay = React.useMemo(() => {
        const passagesToDisplay = [...runner.passages];

        switch (sortColumn) {
            case SortBy.RACE_TIME:
                passagesToDisplay.sort((passageA, passageB) => {
                    if (passageA.processed.lapEndRaceTime < passageB.processed.lapEndRaceTime) {
                        return sortDirection === SortDirection.ASC ? -1 : 1;
                    }

                    if (passageA.processed.lapEndRaceTime > passageB.processed.lapEndRaceTime) {
                        return sortDirection === SortDirection.ASC ? 1 : -1;
                    }

                    return 0;
                });
                break;
            case SortBy.LAP_SPEED:
                passagesToDisplay.sort((passageA, passageB) => {
                    if (passageA.processed.lapSpeed < passageB.processed.lapSpeed) {
                        return sortDirection === SortDirection.ASC ? -1 : 1;
                    }

                    if (passageA.processed.lapSpeed > passageB.processed.lapSpeed) {
                        return sortDirection === SortDirection.ASC ? 1 : -1;
                    }

                    return 0;
                });
                break;
            default:
                throw new Error("Unknown sort column");
        }

        return passagesToDisplay;
    }, [runner, sortColumn, sortDirection]);

    const currentLapTableRow = React.useMemo(() => {
        if (currentLapTime === null) {
            return null;
        }

        return (
            <tr>
                <td colSpan={2}>Tour en cours</td>
                <td>{formatMsAsDuration(raceTime)}</td>
                <td>{formatMsAsDuration(currentLapTime)}</td>
                <td colSpan={42} />
            </tr>
        );
    }, [raceTime, currentLapTime]);

    const currentLapResponsiveTableRow = React.useMemo(() => {
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

    const updateSort = React.useCallback((e: React.MouseEvent<HTMLButtonElement>, clickedSortColumn: SortBy) => {
        e.preventDefault();

        if (clickedSortColumn !== sortColumn) {
            setParams({
                [SearchParam.SORT_COLUMN]: clickedSortColumn,
                [SearchParam.SORT_DIRECTION]: SortDirection.ASC,
            });

            return;
        }

        setParams({ [SearchParam.SORT_DIRECTION]: getOppositeSortDirection(sortDirection) });
    }, [setParams, sortColumn, sortDirection]);

    const onResponsiveSortButtonClick = React.useCallback(() => {
        if (sortColumn === SortBy.RACE_TIME) {
            setParams({
                [SearchParam.SORT_COLUMN]: SortBy.LAP_SPEED,
                [SearchParam.SORT_DIRECTION]: SortDirection.DESC,
            });

            return;
        }

        setParams({
            [SearchParam.SORT_COLUMN]: SortBy.RACE_TIME,
            [SearchParam.SORT_DIRECTION]: SortDirection.ASC,
        });
    }, [setParams, sortColumn]);

    const showCurrentLap = isRaceStarted(race, serverTimeOffset) && !isRaceFinished(race, serverTimeOffset) && sortColumn === SortBy.RACE_TIME;

    const showCurrentLapAtTopOfTable = showCurrentLap && sortDirection === SortDirection.ASC;
    const showCurrentLapAtBottomOfTable = showCurrentLap && sortDirection === SortDirection.DESC;

    return (
        <Row>
            <Col>
                <h2>Détails des tours</h2>

                {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
                    <div style={{ maxWidth: 1400 }}>
                        <table id="runner-laps-table" className="table">
                            <thead>
                                <tr>
                                    <th>Nb. tours</th>
                                    <th>Distance</th>
                                    <th>
                                        <button className="a"
                                                onClick={e => { updateSort(e, SortBy.RACE_TIME); }}
                                        >
                                            Temps de course
                                            {sortColumn === SortBy.RACE_TIME && (
                                                <>
                                                    {sortDirection === SortDirection.ASC && (
                                                        <FontAwesomeIcon icon={faSortDown} className="ms-1" />
                                                    )}
                                                    {sortDirection === SortDirection.DESC && (
                                                        <FontAwesomeIcon icon={faSortUp} className="ms-1" />
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    </th>
                                    <th>Temps au tour</th>
                                    <th>
                                        <button className="a"
                                                onClick={e => { updateSort(e, SortBy.LAP_SPEED); }}
                                        >
                                            Vitesse
                                            {sortColumn === SortBy.LAP_SPEED && (
                                                <>
                                                    {sortDirection === SortDirection.ASC && (
                                                        <FontAwesomeIcon icon={faSortDown} className="ms-1" />
                                                    )}
                                                    {sortDirection === SortDirection.DESC && (
                                                        <FontAwesomeIcon icon={faSortUp} className="ms-1" />
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    </th>
                                    <th>Allure</th>
                                    <th>Vmoy. depuis le début</th>
                                    <th>Allure depuis le début</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showCurrentLapAtTopOfTable && <>{currentLapTableRow}</>}

                                {passagesToDisplay.map((passage, index) => (
                                    <tr key={index}>
                                        <td>
                                            {passage.processed.lapNumber ?? "–"}
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

                                {showCurrentLapAtBottomOfTable && <>{currentLapTableRow}</>}
                            </tbody>
                        </table>
                    </div>
                )}

                {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
                    <div>
                        <div className="mb-3">
                            <button className="button" onClick={onResponsiveSortButtonClick}>
                                {sortColumn === SortBy.RACE_TIME && (
                                    <>Trier par vitesse</>
                                )}

                                {sortColumn === SortBy.LAP_SPEED && (
                                    <>Trier par temps de passage</>
                                )}
                            </button>
                        </div>

                        <table id="runner-laps-table" className="table responsive-runner-laps-table">
                            <tbody>
                                {showCurrentLapAtTopOfTable && <>{currentLapResponsiveTableRow}</>}

                                {passagesToDisplay.map((passage, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div>
                                                <strong>
                                                    {passage.processed.lapNumber === null && (
                                                        <>Premier passage</>
                                                    )}

                                                    {passage.processed.lapNumber !== null && (
                                                        <>Tour {passage.processed.lapNumber}</>
                                                    )}
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

                                {showCurrentLapAtBottomOfTable && <>{currentLapResponsiveTableRow}</>}
                            </tbody>
                        </table>
                    </div>
                )}
            </Col>
        </Row>
    );
}
