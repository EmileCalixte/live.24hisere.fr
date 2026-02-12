import React from "react";
import { ArcElement, Chart, type ChartData, type ChartOptions, DoughnutController, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { numberUtils } from "@live24hisere/utils";
import { useChartLegendColor } from "../../../../../hooks/charts/useChartLegendColor";

Chart.register(ArcElement, DoughnutController, Legend, Tooltip, ChartDataLabels);

interface StartingRunnersDistributionPieChart {
  startingCount: number;
  nonStartingCount: number;
}

export function StartingRunnersDistributionChart({
  startingCount,
  nonStartingCount,
}: StartingRunnersDistributionPieChart): React.ReactElement {
  const legendColor = useChartLegendColor();

  const totalCount = startingCount + nonStartingCount;
  const startingRatio = startingCount / totalCount;
  const nonStartingRatio = nonStartingCount / totalCount;

  const data = React.useMemo<ChartData<"doughnut">>(
    () => ({
      labels: [`Partants (${startingCount})`, `Non-partants (${nonStartingCount})`],
      datasets: [
        {
          data: [startingCount, nonStartingCount],
          backgroundColor: ["#22aa22", "#aaddaa"],
        },
      ],
    }),
    [startingCount, nonStartingCount],
  );

  const options = React.useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      radius: "90%",
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onClick: () => {},
          labels: {
            color: legendColor,
          },
        },
        datalabels: {
          color: ["#fff", "#333"],
          font: {
            size: 12,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: () => [],
            label: (context) => {
              const count = Number(context.raw);

              if (context.dataIndex === 0) {
                return `${count} partant${count > 1 ? "s" : ""} (${numberUtils.formatPercentage(startingRatio)})`;
              }

              return `${count} non-partant${count > 1 ? "s" : ""} (${numberUtils.formatPercentage(nonStartingRatio)})`;
            },
          },
        },
      },
    }),
    [legendColor, startingRatio, nonStartingRatio],
  );

  return <Doughnut data={data} options={options} />;
}
