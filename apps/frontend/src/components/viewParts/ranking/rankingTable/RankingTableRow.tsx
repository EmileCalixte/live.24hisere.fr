import type React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../../constants/misc";
import type { RankingRunner } from "../../../../types/Ranking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../utils/countryUtils";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { getRankingType } from "../../../../utils/rankingUtils";
import { formatGap, type FormatGapMode } from "../../../../utils/runnerUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import RunnerStoppedBadge from "../../../ui/badges/RunnerStoppedBadge";
import { Flag } from "../../../ui/countries/Flag";
import RankingTableRowNCells from "./RankingTableRowNCells";

interface RankingTableRowProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
  showLastPassageTime: boolean;
  formatGapMode: FormatGapMode;
  showRunnerStoppedBadges: boolean;
}

export default function RankingTableRow({
  race,
  runner,
  tableCategoryCode,
  tableGender,
  showLastPassageTime,
  formatGapMode,
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
      <td className="clickable">
        <Link to={`/runner-details/${runner.id}?race=${race.id}`} className="d-flex align-items-center gap-2 no-style">
          {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
          <strong>
            {runner.lastname.toUpperCase()} {runner.firstname}
          </strong>
          {runner.stopped && showRunnerStoppedBadges && <RunnerStoppedBadge />}
          <span className="flex-grow-1" />
          <span className="hide-on-print ranking-table-chevron">
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
        </Link>
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
          {formatGap(runner.gaps.firstRunner[getRankingType(tableCategoryCode, tableGender)].gap, {
            mode: formatGapMode,
          }) ?? NO_VALUE_PLACEHOLDER}
        </td>
      )}
    </tr>
  );
}
