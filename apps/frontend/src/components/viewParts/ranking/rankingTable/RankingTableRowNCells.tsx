import React from "react";
import { type CategoryShortCode, type GenderWithMixed } from "@live24hisere/core/types";
import { categoryUtils } from "@live24hisere/utils";
import { type RankingRunner } from "../../../../types/Ranking";

interface RankingTableRowNCellsProps {
  runner: RankingRunner;
  tableCategory: CategoryShortCode | null;
  tableGender: GenderWithMixed;
}

export default function RankingTableRowNCells({
  runner,
  tableCategory,
  tableGender,
}: RankingTableRowNCellsProps): React.ReactElement {
  const runnerCategory = categoryUtils.getCategoryCodeFromBirthYear(runner.birthYear);

  if (tableCategory === null) {
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
            {runner.ranks.displayed.categoryMixed} {runnerCategory}
          </td>
          <td>
            {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
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
            {runner.ranks.displayed.categoryMixed} {runnerCategory}
          </td>
          <td>
            {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
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
              {runner.ranks.displayed.categoryMixed} {runnerCategory}
            </strong>
          </td>
          <td>{runner.ranks.displayed.scratchMixed}</td>
          <td>
            {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
          </td>
          <td>
            {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
          </td>
        </>
      );
    } else {
      return (
        <>
          <td>
            <strong>
              {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
            </strong>
          </td>
          <td>{runner.ranks.displayed.scratchMixed}</td>
          <td>
            {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
          </td>
          <td>
            {runner.ranks.displayed.categoryMixed} {runnerCategory}
          </td>
        </>
      );
    }
  }
}
