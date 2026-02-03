import React from "react";
import { faFileExcel, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PublicRace, RaceRunnerWithProcessedPassages } from "@live24hisere/core/types";
import { TrackedEvent } from "../../../constants/eventTracking/customEventNames";
import { RUNNER_DETAILS_LAPS_SORT_COLUMNS, SortColumn, SortDirection } from "../../../constants/sort";
import { appContext } from "../../../contexts/AppContext";
import { useSortQueryString } from "../../../hooks/queryString/useSortQueryString";
import { useRaceTime } from "../../../hooks/useRaceTime";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import type { MinimalRankingRunnerInput, RankingRunner } from "../../../types/Ranking";
import { formatMsAsDuration, formatMsDurationHms } from "../../../utils/durationUtils";
import { trackEvent } from "../../../utils/eventTracking/eventTrackingUtils";
import { isRaceFinished, isRaceStarted } from "../../../utils/raceUtils";
import { getOppositeSortDirection } from "../../../utils/sortUtils";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/forms/Button";
import { Table, Td, Th, Tr } from "../../ui/Table";

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
      <Tr>
        <Td colSpan={2}>Tour en cours</Td>
        <Td>{formatMsAsDuration(raceTime)}</Td>
        <Td>{formatMsDurationHms(currentLapTime)}</Td>
        <Td colSpan={42} />
      </Tr>
    );
  }, [currentLapTime, runner.stopped, raceTime]);

  const currentLapResponsiveTableRow = React.useMemo(() => {
    if (runner.stopped) {
      return null;
    }

    return (
      <Tr>
        <Td>
          <div>
            <strong>Tour en cours</strong>
            &nbsp;–&nbsp;
            {formatMsAsDuration(raceTime)}
          </div>

          <div className="text-sm">
            Durée&nbsp;:&nbsp;
            <strong>{formatMsDurationHms(currentLapTime)}</strong>
          </div>
        </Td>
      </Tr>
    );
  }, [currentLapTime, runner.stopped, raceTime]);

  const updateSort = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, clickedSortColumn: SortColumn) => {
      e.preventDefault();

      if (clickedSortColumn !== sortColumn) {
        const newSortDirection = SortDirection.ASC;

        trackEvent(TrackedEvent.CHANGE_RUNNER_LAPS_TABLE_SORT, {
          newSortColumn: clickedSortColumn,
          newSortDirection,
        });

        void setSortColumn(clickedSortColumn);
        void setSortDirection(newSortDirection);

        return;
      }

      const newSortDirection = getOppositeSortDirection(sortDirection);

      trackEvent(TrackedEvent.CHANGE_RUNNER_LAPS_TABLE_SORT, {
        newSortColumn: sortColumn,
        newSortDirection,
      });

      void setSortDirection(newSortDirection);
    },
    [setSortColumn, setSortDirection, sortColumn, sortDirection],
  );

  const onResponsiveSortButtonClick = React.useCallback(() => {
    if (sortColumn === SortColumn.RACE_TIME) {
      const newSortColumn = SortColumn.LAP_SPEED;
      const newSortDirection = SortDirection.DESC;

      trackEvent(TrackedEvent.CHANGE_RUNNER_LAPS_TABLE_SORT, { newSortColumn, newSortDirection });

      void setSortColumn(newSortColumn);
      void setSortDirection(newSortDirection);

      return;
    }

    const newSortColumn = SortColumn.RACE_TIME;
    const newSortDirection = SortDirection.ASC;

    trackEvent(TrackedEvent.CHANGE_RUNNER_LAPS_TABLE_SORT, { newSortColumn, newSortDirection });

    void setSortColumn(newSortColumn);
    void setSortDirection(newSortDirection);
  }, [setSortColumn, setSortDirection, sortColumn]);

  const showCurrentLap =
    isRaceStarted(race, serverTimeOffset)
    && !isRaceFinished(race, serverTimeOffset)
    && sortColumn === SortColumn.RACE_TIME;

  const showCurrentLapAtTopOfTable = showCurrentLap && sortDirection === SortDirection.DESC;
  const showCurrentLapAtBottomOfTable = showCurrentLap && sortDirection === SortDirection.ASC;

  return (
    <Card className="flex flex-col gap-3">
      <h3>Détails des tours</h3>

      <p>
        <Button
          variant="link"
          onClick={() => {
            exportRunnerToXlsx();
          }}
          icon={<FontAwesomeIcon icon={faFileExcel} />}
        >
          Télécharger au format Excel
        </Button>
      </p>

      {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
        <div>
          <Table id="runner-laps-table">
            <thead>
              <Tr>
                <Th>Nb. tours</Th>
                <Th>Distance</Th>
                <Th>
                  <Button
                    variant="link"
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
                  </Button>
                </Th>
                <Th>Temps au tour</Th>
                <Th>
                  <Button
                    variant="link"
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
                  </Button>
                </Th>
                <Th>Allure</Th>
                <Th>Vmoy. depuis le début</Th>
                <Th>Allure depuis le début</Th>
              </Tr>
            </thead>
            <tbody>
              {showCurrentLapAtTopOfTable && <>{currentLapTableRow}</>}

              {passagesToDisplay.map((passage, index) => (
                <Tr key={index}>
                  <Td>{passage.processed.lapNumber ?? "–"}</Td>
                  <Td>{(passage.processed.totalDistance / 1000).toFixed(2)} km</Td>
                  <Td>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</Td>
                  <Td>{formatMsDurationHms(passage.processed.lapDuration)}</Td>
                  <Td>{passage.processed.lapSpeed.toFixed(2)} km/h</Td>
                  <Td>
                    {formatMsDurationHms(passage.processed.lapPace)}
                    <> </>/ km
                  </Td>
                  <Td>{passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h</Td>
                  <Td>
                    {formatMsDurationHms(passage.processed.averagePaceSinceRaceStart)}
                    <> </>/ km
                  </Td>
                </Tr>
              ))}

              {showCurrentLapAtBottomOfTable && <>{currentLapTableRow}</>}
            </tbody>
          </Table>
        </div>
      )}

      {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
        <>
          <div>
            <Button onClick={onResponsiveSortButtonClick}>
              {sortColumn === SortColumn.RACE_TIME && <>Trier par vitesse</>}

              {sortColumn === SortColumn.LAP_SPEED && <>Trier par temps de passage</>}
            </Button>
          </div>

          <Table id="runner-laps-table" className="w-full">
            <tbody>
              {showCurrentLapAtTopOfTable && <>{currentLapResponsiveTableRow}</>}

              {passagesToDisplay.map((passage, index) => (
                <Tr key={index}>
                  <Td>
                    <div>
                      <strong>
                        {passage.processed.lapNumber === null && <>Premier passage</>}

                        {passage.processed.lapNumber !== null && <>Tour {passage.processed.lapNumber}</>}
                      </strong>
                      &nbsp;–&nbsp;
                      {formatMsAsDuration(passage.processed.lapEndRaceTime)}
                    </div>

                    <div className="text-sm">
                      Durée&nbsp;:&nbsp;
                      <strong>{formatMsDurationHms(passage.processed.lapDuration)}</strong>
                      <> </>|<> </>
                      <strong>{passage.processed.lapSpeed.toFixed(2)} km/h</strong>
                      <> </>|<> </>
                      {formatMsDurationHms(passage.processed.lapPace)}
                      <> </>/ km
                    </div>

                    <div className="text-sm">
                      Depuis départ&nbsp;:&nbsp; {passage.processed.averageSpeedSinceRaceStart.toFixed(2)} km/h
                      <> </>|<> </>
                      {formatMsDurationHms(passage.processed.averagePaceSinceRaceStart)}
                      <> </>/ km
                    </div>
                  </Td>
                </Tr>
              ))}

              {showCurrentLapAtBottomOfTable && <>{currentLapResponsiveTableRow}</>}
            </tbody>
          </Table>
        </>
      )}
    </Card>
  );
}
