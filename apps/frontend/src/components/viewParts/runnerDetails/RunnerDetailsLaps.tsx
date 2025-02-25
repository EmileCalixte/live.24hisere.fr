import React from "react";
import { faFileExcel, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PublicRace, RaceRunnerWithProcessedPassages } from "@live24hisere/core/types";
import { RUNNER_DETAILS_LAPS_SORT_COLUMNS, SortColumn, SortDirection } from "../../../constants/sort";
import { useSortQueryString } from "../../../hooks/queryString/useSortQueryString";
import { useRaceTime } from "../../../hooks/useRaceTime";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import type { MinimalRankingRunnerInput, RankingRunner } from "../../../types/Ranking";
import { formatMsAsDuration } from "../../../utils/durationUtils";
import { isRaceFinished, isRaceStarted } from "../../../utils/raceUtils";
import { getOppositeSortDirection } from "../../../utils/sortUtils";
import { appContext } from "../../App";
import { Button } from "../../ui/forms/Button";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

interface RunnerDetailsLapsProps {
  runner: RankingRunner<MinimalRankingRunnerInput & RaceRunnerWithProcessedPassages>;
  race: PublicRace;
  exportRunnerToXlsx: () => unknown;
}

export default function RunnerDetailsLaps({
  runner,
  race,
  exportRunnerToXlsx,
}: RunnerDetailsLapsProps): React.ReactElement {
  const { serverTimeOffset } = React.useContext(appContext).appData;

  const { sortColumn, sortDirection, setSortColumn, setSortDirection } = useSortQueryString(
    RUNNER_DETAILS_LAPS_SORT_COLUMNS,
    SortColumn.RACE_TIME,
  );

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
      case SortColumn.RACE_TIME:
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
      case SortColumn.LAP_SPEED:
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
    }

    return passagesToDisplay;
  }, [runner, sortColumn, sortDirection]);

  const currentLapTableRow = React.useMemo(() => {
    if (runner.stopped) {
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
  }, [currentLapTime, runner.stopped, raceTime]);

  const currentLapResponsiveTableRow = React.useMemo(() => {
    if (runner.stopped) {
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
  }, [currentLapTime, runner.stopped, raceTime]);

  const updateSort = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, clickedSortColumn: SortColumn) => {
      e.preventDefault();

      if (clickedSortColumn !== sortColumn) {
        void setSortColumn(clickedSortColumn);
        void setSortDirection(SortDirection.ASC);

        return;
      }

      void setSortDirection(getOppositeSortDirection(sortDirection));
    },
    [setSortColumn, setSortDirection, sortColumn, sortDirection],
  );

  const onResponsiveSortButtonClick = React.useCallback(() => {
    if (sortColumn === SortColumn.RACE_TIME) {
      void setSortColumn(SortColumn.LAP_SPEED);
      void setSortDirection(SortDirection.DESC);

      return;
    }

    void setSortColumn(SortColumn.RACE_TIME);
    void setSortDirection(SortDirection.ASC);
  }, [setSortColumn, setSortDirection, sortColumn]);

  const showCurrentLap =
    isRaceStarted(race, serverTimeOffset)
    && !isRaceFinished(race, serverTimeOffset)
    && sortColumn === SortColumn.RACE_TIME;

  const showCurrentLapAtTopOfTable = showCurrentLap && sortDirection === SortDirection.DESC;
  const showCurrentLapAtBottomOfTable = showCurrentLap && sortDirection === SortDirection.ASC;

  return (
    <div className="card">
      <h3 className="mt-0">Détails des tours</h3>

      <p className="mb-4">
        <Button variant="a" onClick={exportRunnerToXlsx} icon={<FontAwesomeIcon icon={faFileExcel} />}>
          Télécharger au format Excel
        </Button>
      </p>

      {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
        <div style={{ maxWidth: 1400 }}>
          <table id="runner-laps-table" className="table">
            <thead style={{ position: "sticky", top: 0 }}>
              <tr>
                <th>Nb. tours</th>
                <th>Distance</th>
                <th>
                  <button
                    className="a"
                    onClick={(e) => {
                      updateSort(e, SortColumn.RACE_TIME);
                    }}
                  >
                    Temps de course
                    {sortColumn === SortColumn.RACE_TIME && (
                      <>
                        {sortDirection === SortDirection.ASC && <FontAwesomeIcon icon={faSortDown} className="ms-1" />}
                        {sortDirection === SortDirection.DESC && <FontAwesomeIcon icon={faSortUp} className="ms-1" />}
                      </>
                    )}
                  </button>
                </th>
                <th>Temps au tour</th>
                <th>
                  <button
                    className="a"
                    onClick={(e) => {
                      updateSort(e, SortColumn.LAP_SPEED);
                    }}
                  >
                    Vitesse
                    {sortColumn === SortColumn.LAP_SPEED && (
                      <>
                        {sortDirection === SortDirection.ASC && <FontAwesomeIcon icon={faSortDown} className="ms-1" />}
                        {sortDirection === SortDirection.DESC && <FontAwesomeIcon icon={faSortUp} className="ms-1" />}
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
                  <td>{passage.processed.lapNumber ?? "–"}</td>
                  <td>{(passage.processed.totalDistance / 1000).toFixed(2)} km</td>
                  <td>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</td>
                  <td>{formatMsAsDuration(passage.processed.lapDuration)}</td>
                  <td>{passage.processed.lapSpeed.toFixed(2)} km/h</td>
                  <td>
                    {formatMsAsDuration(passage.processed.lapPace, { forceDisplayHours: false })}
                    /km
                  </td>
                  <td>{passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h</td>
                  <td>
                    {formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, { forceDisplayHours: false })}
                    /km
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
              {sortColumn === SortColumn.RACE_TIME && <>Trier par vitesse</>}

              {sortColumn === SortColumn.LAP_SPEED && <>Trier par temps de passage</>}
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
                        {passage.processed.lapNumber === null && <>Premier passage</>}

                        {passage.processed.lapNumber !== null && <>Tour {passage.processed.lapNumber}</>}
                      </strong>
                      &nbsp;–&nbsp;
                      {formatMsAsDuration(passage.processed.lapEndRaceTime)}
                    </div>

                    <div className="responsive-runner-laps-table-row-secondary-data">
                      Durée&nbsp;:&nbsp;
                      <strong>{formatMsAsDuration(passage.processed.lapDuration)}</strong>
                      <> </>|<> </>
                      <strong>{passage.processed.lapSpeed.toFixed(2)} km/h</strong>
                      <> </>|<> </>
                      {formatMsAsDuration(passage.processed.lapPace, { forceDisplayHours: false })}
                      /km
                    </div>

                    <div className="responsive-runner-laps-table-row-secondary-data">
                      Depuis départ&nbsp;:&nbsp; {passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h
                      <> </>|<> </>
                      {formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, { forceDisplayHours: false })}
                      /km
                    </div>
                  </td>
                </tr>
              ))}

              {showCurrentLapAtBottomOfTable && <>{currentLapResponsiveTableRow}</>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
