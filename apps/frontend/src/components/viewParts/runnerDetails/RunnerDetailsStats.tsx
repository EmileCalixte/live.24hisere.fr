import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { ProcessedPassage, PublicRace, RunnerWithProcessedHours } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import type { Ranking, RankingRunner } from "../../../types/Ranking";
import { formatMsAsDuration, formatMsDurationHms } from "../../../utils/durationUtils";
import { approximateTimeToDistance, getFastestLapPassage, getSlowestLapPassage } from "../../../utils/passageUtils";
import { Card } from "../../ui/Card";
import InfoIconTooltip from "../../ui/InfoIconTooltip";
import { RunnerDetailsStatsLapCard } from "./RunnerDetailsStatsLapCard";
import RunnerDetailsStatsRankingTable from "./RunnerDetailsStatsRankingTable";

interface RunnerDetailsStatsProps {
  runner: RankingRunner & RunnerWithProcessedHours;
  race: PublicRace;
  ranking: Ranking;
}

export default function RunnerDetailsStats({ runner, race, ranking }: RunnerDetailsStatsProps): React.ReactElement {
  const raceInitialDistance = Number(race.initialDistance);

  const hasInitialDistance = raceInitialDistance > 0;

  const completeLapCount = React.useMemo<number>(() => {
    if (hasInitialDistance) {
      return Math.max(0, runner.passages.length - 1);
    }

    return runner.passages.length;
  }, [hasInitialDistance, runner.passages.length]);

  const fastestLapPassage = React.useMemo<ProcessedPassage | null>(
    () => getFastestLapPassage(runner.passages),
    [runner],
  );

  const slowestLapPassage = React.useMemo<ProcessedPassage | null>(
    () => getSlowestLapPassage(runner.passages),
    [runner],
  );

  const splitTime100Km = React.useMemo(() => {
    if (race.isBasicRanking) {
      return undefined;
    }

    return approximateTimeToDistance(100000, runner.passages, runner.totalDistance, race.duration);
  }, [race, runner]);

  const isBasicRanking = race.isBasicRanking;

  return (
    <>
      <Row className="gap-y-3">
        <Col xl={6} lg={8} md={12}>
          <RunnerDetailsStatsRankingTable race={race} runner={runner} ranking={ranking} />

          <p className="mb-0 mt-1">
            <Link to={`/ranking?edition=${race.editionId}&race=${race.id}`}>
              Cliquez ici pour voir le classement complet
            </Link>
          </p>
        </Col>

        <Col xl={6} lg={4} md={12}>
          <Card className="box-border h-full">
            <h3 className="mt-0">Données générales</h3>

            <Row as="ul" className="gap-y-3">
              {!race.isBasicRanking && (
                <Col as="li" xl={6} lg={12} md={6} sm={12}>
                  Nombre de tours&nbsp;: <strong>{completeLapCount}</strong>
                  {hasInitialDistance && (
                    <>
                      <> </>
                      <InfoIconTooltip tooltipText="Il s'agit du nombre de tours complets effectués. La distance initiale parcourue avant le premier passage du coureur au point de chronométrage n'est pas considérée comme un tour." />
                    </>
                  )}
                </Col>
              )}

              <Col as="li" xl={6} lg={12} md={6} sm={12}>
                Distance totale&nbsp;: <strong>{(runner.totalDistance / 1000).toFixed(3)} km</strong>
              </Col>

              <Col as="li" xl={6} lg={12} md={6} sm={12}>
                Vitesse moyenne&nbsp;:
                <> </>
                {runner.totalAverageSpeed ? (
                  <strong>{runner.totalAverageSpeed.toFixed(2)} km/h</strong>
                ) : (
                  NO_VALUE_PLACEHOLDER
                )}
              </Col>

              <Col as="li" xl={6} lg={12} md={6} sm={12}>
                Allure moyenne&nbsp;:
                <> </>
                {runner.totalAveragePace ? (
                  <strong>{formatMsDurationHms(runner.totalAveragePace)} / km</strong>
                ) : (
                  NO_VALUE_PLACEHOLDER
                )}
              </Col>

              {splitTime100Km && splitTime100Km.raceTime !== null && (
                <Col as="li" xl={6} lg={12} md={6} sm={12}>
                  100 km split&nbsp;:
                  <> </>
                  <strong>
                    {!splitTime100Km.exact && <>≈&nbsp;</>}

                    {formatMsAsDuration(splitTime100Km.raceTime)}
                  </strong>
                  <> </>
                  {!splitTime100Km.exact && (
                    <InfoIconTooltip tooltipText="Il s'agit d'une estimation du temps de course auquel le coureur a atteint les 100 km, basée sur ses temps de passage au point de chronométrage avant et après." />
                  )}
                </Col>
              )}
            </Row>
          </Card>
        </Col>

        {!isBasicRanking && (
          <>
            <Col md={6} sm={12}>
              <RunnerDetailsStatsLapCard title="Tour le plus rapide" passage={fastestLapPassage} />
            </Col>

            <Col md={6} sm={12}>
              <RunnerDetailsStatsLapCard title="Tour le plus lent" passage={slowestLapPassage} />
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
