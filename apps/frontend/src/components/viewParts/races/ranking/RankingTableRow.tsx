import type React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "tailwind-variants";
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
import GenderIcon from "../../../ui/genders/GenderIcon";
import { Link } from "../../../ui/Link";
import { TABLE_CELL_PADDING_CLASSNAME, Td, Tr } from "../../../ui/Table";
import RankingTableRowNCells from "./RankingTableRowNCells";

interface RankingTableRowProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: string | null;
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
    <Tr>
      <RankingTableRowNCells
        race={race}
        runner={runner}
        tableCategoryCode={tableCategoryCode}
        tableGender={tableGender}
      />
      <Td>{runner.bibNumber}</Td>
      <Td className="p-0">
        <Link
          to={`/runner-details/${runner.id}?race=${race.id}`}
          className={cn(
            TABLE_CELL_PADDING_CLASSNAME,
            "flex items-center gap-1.5 text-neutral-800 no-underline dark:text-neutral-200",
          )}
        >
          {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}

          <GenderIcon gender={runner.gender} />

          <strong>
            {runner.lastname.toUpperCase()} {runner.firstname}
          </strong>

          {runner.stopped && showRunnerStoppedBadges && <RunnerStoppedBadge />}

          <span className="flex-grow-1" />
          <span className="text-sm text-neutral-500 print:hidden">
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
        </Link>
      </Td>
      {!race.isBasicRanking && (
        <Td>{raceInitialDistance > 0 ? Math.max(0, runner.passages.length - 1) : runner.passages.length}</Td>
      )}
      <Td>{formatFloatNumber(runner.totalDistance / 1000, 2)} km</Td>
      {showLastPassageTime && (
        <Td>
          {(() => {
            if (runner.lastPassageTime === null) {
              return NO_VALUE_PLACEHOLDER;
            } else {
              return formatMsAsDuration(runner.lastPassageTime.raceTime);
            }
          })()}
        </Td>
      )}

      <Td>
        {(() => {
          if (runner.totalAverageSpeed === null) {
            return NO_VALUE_PLACEHOLDER;
          } else {
            return <>{formatFloatNumber(runner.totalAverageSpeed, 2)} km/h</>;
          }
        })()}
      </Td>

      {!race.isBasicRanking && (
        <Td>
          {formatGap(runner.gaps.firstRunner[getRankingType(tableCategoryCode, tableGender)].gap, {
            mode: formatGapMode,
          }) ?? NO_VALUE_PLACEHOLDER}
        </Td>
      )}
    </Tr>
  );
}
