import type React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../../constants/misc";
import type { RankingRunner } from "../../../../types/Ranking";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { getRankingType } from "../../../../utils/rankingUtils";
import { formatGap, type FormatGapMode } from "../../../../utils/runnerUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Td, Tr } from "../../../ui/Table";
import { RunnerNameTd } from "../RunnerNameTd";
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

  return (
    <Tr>
      <RankingTableRowNCells
        race={race}
        runner={runner}
        tableCategoryCode={tableCategoryCode}
        tableGender={tableGender}
      />
      <Td>{runner.bibNumber}</Td>
      <RunnerNameTd runner={runner} race={race} showRunnerStoppedBadges={showRunnerStoppedBadges} />
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
