import type React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { SplitDistanceRankingRunner } from "../../../../types/Ranking";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Td, Tr } from "../../../ui/Table";
import { RunnerNameTd } from "../RunnerNameTd";
import Split100KmTableRowNCells from "./Split100KmTableRowNCells";

interface Split100KmTableRowProps {
  race: PublicRace;
  runner: SplitDistanceRankingRunner;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
}

export default function Split100KmTableRow({
  race,
  runner,
  tableCategoryCode,
  tableGender,
}: Split100KmTableRowProps): React.ReactElement {
  const speedAt100Km = 360_000_000 / runner.raceTime;

  return (
    <Tr>
      <Split100KmTableRowNCells
        race={race}
        runner={runner}
        tableCategoryCode={tableCategoryCode}
        tableGender={tableGender}
      />
      <Td>{runner.bibNumber}</Td>
      <RunnerNameTd runner={runner} race={race} />
      <Td>
        {!runner.exact && "≈ "}
        {formatMsAsDuration(runner.raceTime)}
      </Td>
      <Td>{formatFloatNumber(speedAt100Km, 2)} km/h</Td>
    </Tr>
  );
}
