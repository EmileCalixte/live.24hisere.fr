import type React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "tailwind-variants";
import type { PublicRace, RaceRunner } from "@live24hisere/core/types";
import RunnerStoppedBadge from "../../ui/badges/RunnerStoppedBadge";
import { Link } from "../../ui/Link";
import { TABLE_CELL_PADDING_CLASSNAME, Td } from "../../ui/Table";
import { RunnerNameWithIcons } from "./RunnerNameWithIcons";

interface RunnerNameTdProps {
  runner: RaceRunner;
  race: PublicRace;
  showRunnerStoppedBadges?: boolean;
}

export function RunnerNameTd({ runner, race, showRunnerStoppedBadges = false }: RunnerNameTdProps): React.ReactElement {
  return (
    <Td className="p-0">
      <Link
        to={`/runner-details/${runner.id}?race=${race.id}`}
        className={cn(
          TABLE_CELL_PADDING_CLASSNAME,
          "flex items-center gap-1.5 text-neutral-800 no-underline dark:text-neutral-200",
        )}
      >
        <RunnerNameWithIcons runner={runner} />

        {runner.stopped && showRunnerStoppedBadges && <RunnerStoppedBadge />}

        <span className="grow" />
        <span className="text-sm text-neutral-500 print:hidden">
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
      </Link>
    </Td>
  );
}
