import React from "react";
import { Col, Row } from "react-bootstrap";
import type { ProcessedPassage, PublicRace, RunnerWithProcessedHours } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import type { Ranking, RankingRunner } from "../../../types/Ranking";
import { formatDurationHms } from "../../../utils/durationUtils";
import { getFastestLapPassage, getSlowestLapPassage } from "../../../utils/passageUtils";
import InfoIconTooltip from "../../ui/InfoIconTooltip";
import SpeedChart from "./charts/SpeedChart";
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

                <Row as="ul" className="no-ul-style gap-y-3">
                  <Col as="li" xl={6} lg={12} md={6} sm={12}>
                    Nombre de tours&nbsp;: <strong>{completeLapCount}</strong>
                    {hasInitialDistance && (
                      <>
                        <> </>
                        <InfoIconTooltip tooltipText="Il s'agit du nombre de tours complets effectués. La distance initiale parcourue avant le premier passage du coureur au point de chronométrage n'est pas considérée comme un tour." />
                      </>
                    )}
                  </Col>

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
                      <strong>{formatDurationHms(runner.totalAveragePace)} / km</strong>
                    ) : (
                      NO_VALUE_PLACEHOLDER
                    )}
                  </Col>
                </Row>
              </div>
            </Col>

            <Col md={6} sm={12}>
              <RunnerDetailsStatsLapCard title="Tour le plus rapide" passage={fastestLapPassage} />
            </Col>

            <Col md={6} sm={12}>
              <RunnerDetailsStatsLapCard title="Tour le plus lent" passage={slowestLapPassage} />
            </Col>
          </>
        )}
      </Row>

      {runner.totalAverageSpeed !== null && (
        <Row>
          <Col>
            <h2>Vitesse</h2>

            <SpeedChart runner={runner} race={race} averageSpeed={runner.totalAverageSpeed} />
          </Col>
        </Row>
      )}
    </>
  );
}
