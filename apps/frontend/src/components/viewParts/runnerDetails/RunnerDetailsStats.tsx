import React from "react";
import { Col, Row } from "react-bootstrap";
import type { ProcessedPassage, PublicRace, RunnerWithProcessedHours } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import type { Ranking, RankingRunner } from "../../../types/Ranking";
import { getPaceFromSpeed } from "../../../utils/mathUtils";
import { getFastestLapPassage, getSlowestLapPassage } from "../../../utils/passageUtils";
import { formatMsAsDuration } from "../../../utils/utils";
import InfoIconTooltip from "../../ui/InfoIconTooltip";
import SpeedChart from "./charts/SpeedChart";
import RunnerDetailsStatsRankingTable from "./RunnerDetailsStatsRankingTable";

interface RunnerDetailsStatsProps {
  runner: RankingRunner & RunnerWithProcessedHours;
  race: PublicRace;
  ranking: Ranking;
}

export default function RunnerDetailsStats({ runner, race, ranking }: RunnerDetailsStatsProps): React.ReactElement {
  const raceInitialDistance = Number(race.initialDistance);
  const raceLapDistance = Number(race.lapDistance);

  const hasInitialDistance = raceInitialDistance > 0;

  const completeLapCount = React.useMemo<number>(() => {
    if (hasInitialDistance) {
      return Math.max(0, runner.passages.length - 1);
    }

    return runner.passages.length;
  }, [hasInitialDistance, runner.passages.length]);

  /** Total distance in meters */
  const totalDistance = React.useMemo<number>(() => {
    if (runner.passages.length >= 1) {
      if (hasInitialDistance) {
        return raceInitialDistance + raceLapDistance * (runner.passages.length - 1);
      }

      return raceLapDistance * runner.passages.length;
    }

    return 0;
  }, [hasInitialDistance, raceInitialDistance, raceLapDistance, runner.passages.length]);

  const lastPassageDate = React.useMemo<Date | null>(() => {
    if (runner.passages.length <= 0) {
      return null;
    }

    return new Date(runner.passages[runner.passages.length - 1].time);
  }, [runner]);

  const fastestLapPassage = React.useMemo<ProcessedPassage | null>(
    () => getFastestLapPassage(runner.passages),
    [runner],
  );

  const slowestLapPassage = React.useMemo<ProcessedPassage | null>(
    () => getSlowestLapPassage(runner.passages),
    [runner],
  );

  /** Last runner passage race time in ms */
  const lastPassageRaceTime = React.useMemo<number | null>(() => {
    if (lastPassageDate === null) {
      return null;
    }

    return lastPassageDate.getTime() - new Date(race.startTime).getTime();
  }, [race, lastPassageDate]);

  /** Total runner average speed in km/h */
  const averageSpeed = React.useMemo<number | null>(() => {
    if (lastPassageRaceTime === null) {
      return null;
    }

    //                  m/ms                     m/s    km/h
    return (totalDistance / lastPassageRaceTime) * 1000 * 3.6;
  }, [totalDistance, lastPassageRaceTime]);

  /** Total runner average pace in ms/km */
  const averagePace = React.useMemo<number | null>(() => {
    if (averageSpeed === null) {
      return null;
    }

    return getPaceFromSpeed(averageSpeed);
  }, [averageSpeed]);

  const isBasicRanking = race.isBasicRanking;

  return (
    <>
      <Row className="gap-y-3">
        <Col xl={6} lg={8} md={12}>
          <RunnerDetailsStatsRankingTable race={race} runner={runner} ranking={ranking} />
        </Col>

        {!isBasicRanking && (
          <>
            <Col xl={6} lg={4} md={12}>
              <div className="card h-100 border-box">
                <h3 className="mt-0">Données générales</h3>

                <ul className="no-ul-style d-flex flex-lg-column flex-xl-row gap-2">
                  {" "}
                  {/* TODO 2 items per row in xl */}
                  <li>
                    Nombre de tours : <strong>{completeLapCount}</strong>
                    {hasInitialDistance && (
                      <>
                        <> </>
                        <InfoIconTooltip tooltipText="Il s'agit du nombre de tours complets effectués. La distance initiale parcourue avant le premier passage du coureur au point de chronométrage n'est pas considérée comme un tour." />
                      </>
                    )}
                  </li>
                  <li>
                    Distance totale : <strong>{(totalDistance / 1000).toFixed(3)} km</strong>
                  </li>
                  <li>
                    Vitesse moyenne : <strong>TODO km/h</strong>
                  </li>
                  <li>
                    Allure moyenne : <strong>TODO / km</strong>
                  </li>
                </ul>
              </div>
            </Col>
          </>
        )}

        <p>Statistiques de course</p>

        <ul>
          <li>
            Nombre de tours complets : <strong>{completeLapCount}</strong>
          </li>
          <li>
            Distance totale : <strong>{(totalDistance / 1000).toFixed(3)} km</strong>
          </li>

          <li>
            Tour le plus rapide : {fastestLapPassage === null && NO_VALUE_PLACEHOLDER}
            {fastestLapPassage !== null && (
              <ul>
                <li>
                  Tour {fastestLapPassage.processed.lapNumber} à{" "}
                  <strong>{formatMsAsDuration(fastestLapPassage.processed.lapEndRaceTime)}</strong> de course
                </li>
                <li>
                  Durée du tour : <strong>{formatMsAsDuration(fastestLapPassage.processed.lapDuration)}</strong>
                </li>
                <li>
                  Vitesse : <strong>{fastestLapPassage.processed.lapSpeed.toFixed(2)} km/h</strong>
                </li>
                <li>
                  Allure :{" "}
                  <strong>
                    {formatMsAsDuration(fastestLapPassage.processed.lapPace, false)}
                    /km
                  </strong>
                </li>
              </ul>
            )}
          </li>

          <li>
            Tour le plus lent : {slowestLapPassage === null && NO_VALUE_PLACEHOLDER}
            {slowestLapPassage !== null && (
              <ul>
                <li>
                  Tour {slowestLapPassage.processed.lapNumber} à{" "}
                  <strong>{formatMsAsDuration(slowestLapPassage.processed.lapEndRaceTime)}</strong> de course
                </li>
                <li>
                  Durée : <strong>{formatMsAsDuration(slowestLapPassage.processed.lapDuration)}</strong>
                </li>
                <li>
                  Vitesse : <strong>{slowestLapPassage.processed.lapSpeed.toFixed(2)} km/h</strong>
                </li>
                <li>
                  Allure :{" "}
                  <strong>
                    {formatMsAsDuration(slowestLapPassage.processed.lapPace, false)}
                    /km
                  </strong>
                </li>
              </ul>
            )}
          </li>

          <li>
            Vitesse moyenne de 00:00:00 à{" "}
            {lastPassageRaceTime !== null ? formatMsAsDuration(lastPassageRaceTime) : "--:--:--"}
            <> : </>
            <strong>{averageSpeed !== null ? averageSpeed.toFixed(2) + " km/h" : "n/a"}</strong>
            {averagePace !== null && (
              <ul>
                <li>
                  Allure : <strong>{formatMsAsDuration(averagePace, false) + "/km"}</strong>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </Row>

      {averageSpeed !== null && (
        <Row>
          <Col>
            <h2>Vitesse</h2>

            <SpeedChart runner={runner} race={race} averageSpeed={averageSpeed} />
          </Col>
        </Row>
      )}
    </>
  );
}
