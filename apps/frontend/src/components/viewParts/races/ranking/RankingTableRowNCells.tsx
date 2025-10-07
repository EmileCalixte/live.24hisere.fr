import type React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import type { RankingRunner } from "../../../../types/Ranking";
import { Td } from "../../../ui/Table";

interface RankingTableRowNCellsProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
}

export default function RankingTableRowNCells({
  race,
  runner,
  tableCategoryCode,
  tableGender,
}: RankingTableRowNCellsProps): React.ReactElement {
  const getCategory = useGetRunnerCategory();

  const runnerCategoryCode = getCategory(runner, new Date(race.startTime)).code;

  if (tableCategoryCode === null) {
    if (tableGender === "mixed") {
      return (
        <>
          <Td>
            <strong>{runner.ranks.displayed.scratchMixed}</strong>
          </Td>
          <Td>
            {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
          </Td>
          <Td>
            {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
          </Td>
          <Td>
            {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
          </Td>
        </>
      );
    } else {
      return (
        <>
          <Td>
            <strong>
              {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
            </strong>
          </Td>
          <Td>{runner.ranks.displayed.scratchMixed}</Td>
          <Td>
            {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
          </Td>
          <Td>
            {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
          </Td>
        </>
      );
    }
  } else if (tableGender === "mixed") {
    return (
      <>
        <Td>
          <strong>
            {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
          </strong>
        </Td>
        <Td>{runner.ranks.displayed.scratchMixed}</Td>
        <Td>
          {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
        </Td>
        <Td>
          {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
        </Td>
      </>
    );
  } else {
    return (
      <>
        <Td>
          <strong>
            {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
          </strong>
        </Td>
        <Td>{runner.ranks.displayed.scratchMixed}</Td>
        <Td>
          {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
        </Td>
        <Td>
          {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
        </Td>
      </>
    );
  }
}
