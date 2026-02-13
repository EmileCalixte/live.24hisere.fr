import React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import { ArcElement, Chart, type ChartData, type ChartOptions, DoughnutController, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { numberUtils, objectUtils } from "@live24hisere/utils";
import { CATEGORY_COLORS } from "../../../../../constants/chart";
import { useChartLegendColor } from "../../../../../hooks/charts/useChartLegendColor";
import { useGetCategoryDisplayNameFromCode } from "../../../../../hooks/charts/useGetCategoryDisplayNameFromCode";

Chart.register(ArcElement, DoughnutController, Legend, Tooltip, ChartDataLabels);

export type CategoryDistribution = Partial<Record<CategoryCode | "custom", number>>;

interface CategoryDistributionChartProps {
  countsByCategory: CategoryDistribution;
  categories: Record<string, string>;
}

export function CategoryDistributionChart({
  countsByCategory,
  categories,
}: CategoryDistributionChartProps): React.ReactElement {
  const legendColor = useChartLegendColor();

  const totalCount = Object.values(countsByCategory).reduce((totalCount, count) => totalCount + count);

  const getCategoryDisplayNameFromCode = useGetCategoryDisplayNameFromCode(categories);

  const data = React.useMemo<ChartData<"doughnut">>(
    () => ({
      labels: objectUtils
        .entries(countsByCategory)
        .map(([categoryCode, count]) => `${getCategoryDisplayNameFromCode(categoryCode)} (${count})`),
      datasets: [
        {
          data: Object.values(countsByCategory),
          backgroundColor: objectUtils
            .keys(countsByCategory)
            .map((categoryCode) => CATEGORY_COLORS[categoryCode] ?? "#ccc"),
        },
      ],
    }),
    [countsByCategory, getCategoryDisplayNameFromCode],
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
          color: "#fff",
          font: {
            size: 12,
          },
          formatter: (value, context) => `${value} ${objectUtils.keys(countsByCategory)[context.dataIndex]}`,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: () => [],
            label: (context) => {
              const count = Number(context.raw);
              const categoryName = getCategoryDisplayNameFromCode(
                objectUtils.keys(countsByCategory)[context.dataIndex],
              );

              return `${count} ${categoryName} (${numberUtils.formatPercentage(count / totalCount)})`;
            },
          },
        },
      },
    }),
    [countsByCategory, getCategoryDisplayNameFromCode, totalCount, legendColor],
  );

  return <Doughnut data={data} options={options} />;
}
