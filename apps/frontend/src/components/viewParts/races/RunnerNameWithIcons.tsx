import type React from "react";
import type { PublicRunner } from "@live24hisere/core/types";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../utils/countryUtils";
import { Flag } from "../../ui/countries/Flag";
import GenderIcon from "../../ui/genders/GenderIcon";

interface RunnerNameWithIconsProps {
  runner: PublicRunner;
  strongClassName?: string;
}

export function RunnerNameWithIcons({ runner, strongClassName }: RunnerNameWithIconsProps): React.ReactElement {
  const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

  return (
    <>
      {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}

      <GenderIcon gender={runner.gender} />

      <strong className={strongClassName}>
        {runner.lastname.toUpperCase()} {runner.firstname}
      </strong>
    </>
  );
}
