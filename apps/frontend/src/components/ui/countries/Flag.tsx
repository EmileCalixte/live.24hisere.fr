import React from "react";
import { getCountryName } from "../../../utils/countryUtils";
import { Tooltip } from "../Tooltip";
import { EmptyFlag } from "./EmptyFlag";

interface FlagProps {
  /**
   * The ISO 3166-1 Alpha 2 (two-letter) country code
   */
  countryCode: string;
}

/**
 * See https://www.npmjs.com/package/country-flag-icons
 */
const BASE_URLS = [
  "https://purecatamphetamine.github.io/country-flag-icons/3x2/",
  "https://catamphetamine.gitlab.io/country-flag-icons/3x2/",
];

export function Flag({ countryCode }: FlagProps): React.ReactElement {
  const [baseUrlIndex, setBaseUrlIndex] = React.useState(0);

  const baseUrl = BASE_URLS[baseUrlIndex];

  const countryName = React.useMemo(() => getCountryName(countryCode), [countryCode]);

  const Flag = (): React.ReactElement => (
    <span style={{ display: "block" }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <EmptyFlag />

        {baseUrl && (
          <image
            href={`${baseUrl}${countryCode}.svg`}
            width="100%"
            height="100%"
            // eslint-disable-next-line react/no-unknown-property -- This property does exist
            onError={() => {
              setBaseUrlIndex((n) => n + 1);
            }}
          />
        )}
      </svg>
    </span>
  );

  return countryName ? (
    <Tooltip title={countryName}>
      <Flag />
    </Tooltip>
  ) : (
    <Flag />
  );
}
