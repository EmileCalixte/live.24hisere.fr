import React from "react";
import { numberUtils } from "@live24hisere/utils";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

interface StartingRunnersDistributionPieChart {
  startingCount: number;
  nonStartingCount: number;
}

export function StartingRunnersDistributionChart({
  startingCount,
  nonStartingCount,
}: StartingRunnersDistributionPieChart): React.ReactElement {
  const chartTheme = useChartTheme();

  const totalCount = startingCount + nonStartingCount;
  const startingRatio = startingCount / totalCount;
  const nonStartingRatio = nonStartingCount / totalCount;

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
          dataPoints: [
            {
              y: startingCount,
              legendText: `Partants (${startingCount})`,
              indexLabel: startingCount.toString(),
              indexLabelFontColor: "white",
              toolTipContent: `${startingCount} partant${startingCount > 1 ? "s" : ""} (${numberUtils.formatPercentage(startingRatio)})`,
              color: "#22aa22",
            },
            {
              y: nonStartingCount,
              legendText: `Non-partants (${nonStartingCount})`,
              indexLabel: nonStartingCount.toString(),
              indexLabelFontColor: "#333",
              toolTipContent: `${nonStartingCount} non-partant${nonStartingCount > 1 ? "s" : ""} (${numberUtils.formatPercentage(nonStartingRatio)})`,
              color: "#aaddaa",
            },
          ],
        },
      ],
    }),
    [chartTheme, nonStartingCount, nonStartingRatio, startingCount, startingRatio],
  );

  return <CanvasJSChart options={options} />;
}
