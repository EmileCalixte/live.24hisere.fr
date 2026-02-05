/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import {
  ArcElement,
  Chart,
  type ChartData,
  type ChartOptions,
  Colors,
  DoughnutController,
  Legend,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { numberUtils, objectUtils } from "@live24hisere/utils";
import { useChartLegendColor } from "../../../../../hooks/charts/useChartLegendColor";
import { getCountryName } from "../../../../../utils/countryUtils";

Chart.register(ArcElement, DoughnutController, Legend, Tooltip, Colors, ChartDataLabels);

/**
 * Country code as key, count as value
 */
export type CountryDistribution = Record<string, number>;

interface CountryDistributionChartProps {
  countsByCountry: CountryDistribution;
}

export function CountryDistributionChart({ countsByCountry }: CountryDistributionChartProps): React.ReactElement {
  const legendColor = useChartLegendColor();

  const totalCount = Object.values(countsByCountry).reduce((totalCount, count) => totalCount + count);

  const data = React.useMemo<ChartData<"doughnut">>(
    () => ({
      labels: objectUtils
        .entries(countsByCountry)
        .map(([countryCode, count]) => `${getCountryName(countryCode) ?? "Autres"} (${count})`),
      datasets: [
        {
          data: objectUtils.entries(countsByCountry).map(([countryCode, count]) => count),
        },
      ],
    }),
    [countsByCountry],
  );

  const options = React.useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      radius: "90%",
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          onClick: () => {},
          labels: {
            color: legendColor,
          },
        },
        datalabels: {
          color: "#fff",
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
              const countryName = getCountryName(objectUtils.keys(countsByCountry)[context.dataIndex]);

              return `${countryName} : ${count} (${numberUtils.formatPercentage(count / totalCount)})`;
            },
          },
        },
      },
    }),
    [countsByCountry, legendColor, totalCount],
  );

  return <Doughnut data={data} options={options} />;
}
