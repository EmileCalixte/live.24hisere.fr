import React from "react";
import { numberUtils, objectUtils } from "@live24hisere/utils";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";
import { getCountryName } from "../../../../../utils/countryUtils";

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

/**
 * Country code as key, count as value
 */
export type CountryDistribution = Record<string, number>;

interface CountryDistributionChartProps {
  countsByCountry: CountryDistribution;
}

export function CountryDistributionChart({ countsByCountry }: CountryDistributionChartProps): React.ReactElement {
  const chartTheme = useChartTheme();

  const totalCount = Object.values(countsByCountry).reduce((totalCount, count) => totalCount + count);

  const options = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      theme: chartTheme,
      data: [
        {
          // type: "pie",
          type: "doughnut",
          explodeOnClick: false,
          showInLegend: true,
          indexLabelPlacement: "inside",
          indexLabelFontColor: "white",
          dataPoints: objectUtils.entries(countsByCountry).map(([countryCode, count]) => {
            const countryName = getCountryName(countryCode) ?? "Autres";

            return {
              y: count,
              indexLabel: count.toString(),
              legendText: `${countryName} (${count})`,
              toolTipContent: `${countryName} : ${count} (${numberUtils.formatPercentage(count / totalCount)})`,
            };
          }),
        },
      ],
    }),
    [countsByCountry, chartTheme, totalCount],
  );

  return <CanvasJSChart options={options} />;
}
