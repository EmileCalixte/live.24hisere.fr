import React from "react";
import { getCountryName } from "../../../utils/countryUtils";
import { Tooltip } from "../Tooltip";

interface FlagProps {
  /**
   * The ISO 3166-1 Alpha 2 (two-letter) country code
   */
  countryCode: string;

  width?: React.CSSProperties["width"];
}

/**
 * See https://www.npmjs.com/package/country-flag-icons
 */
const BASE_URLS = [
  "https://purecatamphetamine.github.io/country-flag-icons/3x2/",
  "https://catamphetamine.gitlab.io/country-flag-icons/3x2/",
];

export function Flag({
  countryCode,
  width = "1.5em", // Aspect-ratio 3:2, so it's equivalent to height 1em
}: FlagProps): React.ReactElement {
  const [baseUrlIndex, setBaseUrlIndex] = React.useState(0);

  const baseUrl = BASE_URLS[baseUrlIndex];

  const countryName = React.useMemo(() => getCountryName(countryCode), [countryCode]);

  const Flag = (): React.ReactElement => (
    <span
      style={{
        display: "inline-block",
        width,
        aspectRatio: "3/2",
        borderRadius: "0.2em",
        overflow: "hidden",
        boxShadow: "0.05em 0.05em 0.2em #0005",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" style={{ width: "100%" }}>
        <path fill="#DDD" d="M0 0h512v342H0z" />

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
    <Tooltip title={countryName} style={{ display: "inline-block", lineHeight: 0 }}>
      <Flag />
    </Tooltip>
  ) : (
    <Flag />
  );
}
