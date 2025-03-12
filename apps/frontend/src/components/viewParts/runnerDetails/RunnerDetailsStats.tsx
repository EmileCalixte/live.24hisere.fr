import React from "react";
import type { ProcessedPassage, PublicRace, RunnerWithProcessedHours } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import type { Ranking, RankingRunner } from "../../../types/Ranking";
import { formatMsAsDuration, formatMsDurationHms } from "../../../utils/durationUtils";
import { approximateTimeToDistance, getFastestLapPassage, getSlowestLapPassage } from "../../../utils/passageUtils";
import { Card } from "../../ui/Card";
import InfoIconTooltip from "../../ui/InfoIconTooltip";
import { Link } from "../../ui/Link";
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
      <div className="grid-rows-auto grid grid-cols-6 gap-3">
        <div className="col-span-6 lg:col-span-4 xl:col-span-3">
          <RunnerDetailsStatsRankingTable race={race} runner={runner} ranking={ranking} />

          <p className="mb-0 mt-1">
            <Link to={`/ranking?edition=${race.editionId}&race=${race.id}`}>
              Cliquez ici pour voir le classement complet
            </Link>
          </p>
        </div>

        <Card className="col-span-6 flex h-full flex-col gap-3 lg:col-span-2 xl:col-span-3">
          <h3>Données générales</h3>

          <ul className="grid-rows-auto grid grid-cols-2 gap-3">
            {!race.isBasicRanking && (
              <li className="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
                Nombre de tours&nbsp;: <strong>{completeLapCount}</strong>
                {hasInitialDistance && (
                  <>
                    <> </>
                    <InfoIconTooltip tooltipText="Il s'agit du nombre de tours complets effectués. La distance initiale parcourue avant le premier passage du coureur au point de chronométrage n'est pas considérée comme un tour." />
                  </>
                )}
              </li>
            )}

            <li className="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
              Distance totale&nbsp;: <strong>{(runner.totalDistance / 1000).toFixed(3)} km</strong>
            </li>

            <li className="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
              Vitesse moyenne&nbsp;:
              <> </>
              {runner.totalAverageSpeed ? (
                <strong>{runner.totalAverageSpeed.toFixed(2)} km/h</strong>
              ) : (
                NO_VALUE_PLACEHOLDER
              )}
            </li>

            <li className="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
              Allure moyenne&nbsp;:
              <> </>
              {runner.totalAveragePace ? (
                <strong>{formatMsDurationHms(runner.totalAveragePace)} / km</strong>
              ) : (
                NO_VALUE_PLACEHOLDER
              )}
            </li>

            {splitTime100Km && splitTime100Km.raceTime !== null && (
              <li className="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
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
              </li>
            )}
          </ul>
        </Card>

        {!isBasicRanking && (
          <>
            <RunnerDetailsStatsLapCard
              className="col-span-6 sm:col-span-3"
              title="Tour le plus rapide"
              passage={fastestLapPassage}
            />

            <RunnerDetailsStatsLapCard
              className="col-span-6 sm:col-span-3"
              title="Tour le plus lent"
              passage={slowestLapPassage}
            />
          </>
        )}
      </div>
    </>
  );
}
