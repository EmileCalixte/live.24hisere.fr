import React from "react";
import { numberUtils } from "@live24hisere/utils";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

interface GenderDistributionPieChart {
  maleCount: number;
  femaleCount: number;
}

export function GenderDistributionChart({ maleCount, femaleCount }: GenderDistributionPieChart): React.ReactElement {
  const chartTheme = useChartTheme();

  const totalCount = maleCount + femaleCount;
  const maleRatio = maleCount / totalCount;
  const femaleRatio = femaleCount / totalCount;

  const options = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      theme: chartTheme,
      data: [
        {
          // type: "pie",
          type: "doughnut",
          showInLegend: true,
          toolTipContent: "{indexLabel}",
          dataPoints: [
            {
              y: maleCount,
              legendText: "Hommes",
              indexLabel: `${maleCount} homme${maleCount > 1 ? "s" : ""} (${numberUtils.formatPercentage(maleRatio)})`,
              color: "#5a79d6",
            },
            {
              y: femaleCount,
              legendText: "Femmes",
              indexLabel: `${femaleCount} femme${femaleCount > 1 ? "s" : ""} (${numberUtils.formatPercentage(femaleRatio)})`,
              color: "#d65a5a",
            },
          ],
        },
      ],
    }),
    [chartTheme, femaleCount, femaleRatio, maleCount, maleRatio],
  );

  return <CanvasJSChart options={options} />;
}
