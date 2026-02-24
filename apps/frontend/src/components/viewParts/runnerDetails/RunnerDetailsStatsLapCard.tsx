import type React from "react";
import { cn } from "tailwind-variants";
import type { ProcessedPassage } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import { formatMsAsDuration, formatMsDurationHms } from "../../../utils/durationUtils";
import { Card } from "../../ui/Card";

interface RunnerDetailsStatsLapCardProps {
  title: string;
  passage: ProcessedPassage | null;
  className?: string;
}

export function RunnerDetailsStatsLapCard({
  title,
  passage,
  className,
}: RunnerDetailsStatsLapCardProps): React.ReactElement {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <h3>
        {title}&nbsp;: {passage ? formatMsDurationHms(passage.processed.lapDuration) : NO_VALUE_PLACEHOLDER}
      </h3>

      {passage && (
        <ul className="grid-rows-auto grid grid-cols-2 gap-3">
          <li className="col-span-full">
            Tour n° {passage.processed.lapNumber}
            <> </>à <strong>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</strong> de course
          </li>

          <li className="col-span-2 xl:col-span-1">
            Vitesse&nbsp;: <strong>{passage.processed.lapSpeed.toFixed(2)} km/h</strong>
          </li>

          <li className="col-span-2 xl:col-span-1">
            Allure&nbsp;:
            <> </>
            <strong>
              {formatMsDurationHms(passage.processed.lapPace)}
              <> </>/ km
            </strong>
          </li>
        </ul>
      )}
    </Card>
  );
}
