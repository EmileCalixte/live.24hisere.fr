import type React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import { Link } from "react-router-dom";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../../constants/misc";
import type { RankingRunner } from "../../../../types/Ranking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../utils/countryUtils";
import { getRankingType } from "../../../../utils/rankingUtils";
import { formatGap } from "../../../../utils/runnerUtils";
import { formatFloatNumber, formatMsAsDuration } from "../../../../utils/utils";
import RunnerStoppedBadge from "../../../ui/badges/RunnerStoppedBadge";
import { Flag } from "../../../ui/countries/Flag";
import RankingTableRowNCells from "./RankingTableRowNCells";

interface RankingTableRowProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
  showLastPassageTime: boolean;
  showRunnerStoppedBadges: boolean;
}

export default function RankingTableRow({
  race,
  runner,
  tableCategoryCode,
  tableGender,
  showLastPassageTime,
  showRunnerStoppedBadges,
}: RankingTableRowProps): React.ReactElement {
  const raceInitialDistance = Number(race.initialDistance);

  const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

  return (
    <tr>
      <RankingTableRowNCells
        race={race}
        runner={runner}
        tableCategoryCode={tableCategoryCode}
        tableGender={tableGender}
      />
      <td>{runner.bibNumber}</td>
      <td>
        <span className="d-flex align-items-center gap-2">
          {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
          <span>
            {runner.lastname.toUpperCase()} {runner.firstname}
          </span>
          {runner.stopped && showRunnerStoppedBadges && <RunnerStoppedBadge />}
        </span>
      </td>
      {!race.isBasicRanking && (
        <td>{raceInitialDistance > 0 ? Math.max(0, runner.passages.length - 1) : runner.passages.length}</td>
      )}
      <td>{formatFloatNumber(runner.totalDistance / 1000, 2)} km</td>
      {showLastPassageTime && (
        <td>
          {(() => {
            if (runner.lastPassageTime === null) {
              return NO_VALUE_PLACEHOLDER;
            } else {
              return formatMsAsDuration(runner.lastPassageTime.raceTime);
            }
          })()}
        </td>
      )}

      <td>
        {(() => {
          if (runner.totalAverageSpeed === null) {
            return NO_VALUE_PLACEHOLDER;
          } else {
            return <>{formatFloatNumber(runner.totalAverageSpeed, 2)} km/h</>;
          }
        })()}
      </td>

      {!race.isBasicRanking && (
        <td>
          {formatGap(runner.gaps.firstRunner[getRankingType(tableCategoryCode, tableGender)].gap) ??
            NO_VALUE_PLACEHOLDER}
        </td>
      )}

      <td className="hide-on-print">
        <Link to={`/runner-details/${runner.id}`}>Détails</Link>
      </td>
    </tr>
  );
}
