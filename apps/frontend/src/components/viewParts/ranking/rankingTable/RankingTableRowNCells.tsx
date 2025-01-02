import type React from "react";
import { type CategoryCode, getCategory } from "@emilecalixte/ffa-categories";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { RankingRunner } from "../../../../types/Ranking";

interface RankingTableRowNCellsProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
}

export default function RankingTableRowNCells({
  race,
  runner,
  tableCategoryCode,
  tableGender,
}: RankingTableRowNCellsProps): React.ReactElement {
  const runnerCategoryCode = getCategory(Number(runner.birthYear), { date: new Date(race.startTime) }).code;

  if (tableCategoryCode === null) {
    if (tableGender === "mixed") {
      return (
        <>
          <td>
            <strong>{runner.ranks.displayed.scratchMixed}</strong>
          </td>
          <td>
            {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
          </td>
          <td>
            {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
          </td>
          <td>
            {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
          </td>
        </>
      );
    } else {
      return (
        <>
          <td>
            <strong>
              {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
            </strong>
          </td>
          <td>{runner.ranks.displayed.scratchMixed}</td>
          <td>
            {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
          </td>
          <td>
            {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
          </td>
        </>
      );
    }
  } else {
    if (tableGender === "mixed") {
      return (
        <>
          <td>
            <strong>
              {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
            </strong>
          </td>
          <td>{runner.ranks.displayed.scratchMixed}</td>
          <td>
            {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
          </td>
          <td>
            {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
          </td>
        </>
      );
    } else {
      return (
        <>
          <td>
            <strong>
              {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
            </strong>
          </td>
          <td>{runner.ranks.displayed.scratchMixed}</td>
          <td>
            {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
          </td>
          <td>
            {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
          </td>
        </>
      );
    }
  }
}
