import type React from "react";
import type { PassageWithRunner, ProcessedPassage, PublicRace, RaceRunner } from "@live24hisere/core/types";
import { formatMsAsDuration, formatMsDurationHms } from "../../../../../utils/durationUtils";
import { formatFloatNumber } from "../../../../../utils/utils";
import { Td, Tr } from "../../../../ui/Table";
import ResponsiveTableRunnerLinkTd from "../../ResponsiveTableRunnerLinkTd";
import { RunnerNameWithIcons } from "../../RunnerNameWithIcons";

interface ResponsiveFastestLapsTableRowProps {
  race: PublicRace;
  passage: PassageWithRunner<ProcessedPassage, RaceRunner>;
}

export default function ResponsiveFastestLapsTableRow({
  race,
  passage,
}: ResponsiveFastestLapsTableRowProps): React.ReactElement {
  return (
    <Tr>
      <Td className="w-full">
        <div className="flex flex-wrap items-center gap-1.5">
          <RunnerNameWithIcons runner={passage.runner} />
        </div>

        <div className="text-sm">
          <strong>N° {passage.runner.bibNumber}</strong>
        </div>

        <div>
          <strong>
            {formatMsAsDuration(passage.processed.lapDuration, {
              forceDisplayHours: false,
              hoursSuffix: "h ",
              minutesSuffix: "m ",
              secondsSuffix: "s",
            })}
          </strong>
        </div>

        <div className="text-sm">À {formatMsAsDuration(passage.processed.lapEndRaceTime)} de course</div>

        <div className="text-sm">
          {formatFloatNumber(passage.processed.lapSpeed, 2)} km/h &nbsp;–&nbsp;
          {formatMsDurationHms(passage.processed.lapPace)} / km
        </div>
      </Td>

      <ResponsiveTableRunnerLinkTd race={race} runner={passage.runner} />
    </Tr>
  );
}
