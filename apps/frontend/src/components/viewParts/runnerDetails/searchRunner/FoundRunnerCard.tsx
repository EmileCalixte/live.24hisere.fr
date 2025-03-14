import type React from "react";
import type { RunnerWithRaceCount } from "@live24hisere/core/types";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../utils/countryUtils";
import { Card } from "../../../ui/Card";
import { Flag } from "../../../ui/countries/Flag";

interface FoundRunnerCardProps {
  runner: RunnerWithRaceCount;
}

export function FoundRunnerCard({ runner }: FoundRunnerCardProps): React.ReactElement {
  const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

  return (
    <Card className="transition-colors hover:bg-neutral-100 hover:dark:bg-neutral-700">
      <p className="flex items-center gap-2">
        {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
        <strong>
          {runner.lastname.toUpperCase()} {runner.firstname}
        </strong>
      </p>

      <p className="m-0">{runner.birthYear}</p>

      <p className="m-0">
        {runner.raceCount} {runner.raceCount > 1 ? "courses" : "course"}
      </p>
    </Card>
  );
}
