import type React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PublicRace, PublicRunner } from "@live24hisere/core/types";
import { Link } from "../../ui/Link";
import { Td } from "../../ui/Table";

interface ResponsiveTableRunnerLinkTdProps {
  race: PublicRace;
  runner: PublicRunner;
}

export default function ResponsiveTableRunnerLinkTd({
  race,
  runner,
}: ResponsiveTableRunnerLinkTdProps): React.ReactElement {
  return (
    <Td className="relative p-0">
      <Link
        to={`/runner-details/${runner.id}?race=${race.id}`}
        className="flex items-center px-3 text-neutral-500 after:absolute after:inset-0 dark:text-neutral-500"
        aria-label={`Consulter les détails du coureur ${runner.firstname} ${runner.lastname}`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Link>
    </Td>
  );
}
