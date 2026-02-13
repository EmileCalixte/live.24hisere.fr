import React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartData,
  type ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { GENDER } from "@live24hisere/core/constants";
import { objectUtils } from "@live24hisere/utils";
import { GENDER_COLORS } from "../../../../../constants/chart";
import { useChartGridColor } from "../../../../../hooks/charts/useChartGridColor";
import { useChartLegendColor } from "../../../../../hooks/charts/useChartLegendColor";
import { useGetCategoryDisplayNameFromCode } from "../../../../../hooks/charts/useGetCategoryDisplayNameFromCode";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip, ChartDataLabels);

export type CategoryGenderDistribution = Partial<
  Record<CategoryCode | "custom", { [GENDER.M]: number; [GENDER.F]: number }>
>;

interface GenderCountPerCategoryChartProps {
  genderCountsByCategory: CategoryGenderDistribution;
  categories: Record<string, string>;
}

export function GenderCountPerCategoryChart({
  genderCountsByCategory,
  categories,
}: GenderCountPerCategoryChartProps): React.ReactElement {
  const legendColor = useChartLegendColor();
  const gridColor = useChartGridColor();

  const getDisplayedCategoryCodeAndName = React.useCallback(
    (categoryCode: CategoryCode | "custom") => {
      const code = categoryCode === "custom" ? "Autres" : categoryCode;
      const name = categories[categoryCode] ?? code;

      return { code, name };
    },
    [categories],
  );

  const getCategoryDisplayNameFromCode = useGetCategoryDisplayNameFromCode(categories);

  const data = React.useMemo<ChartData<"bar">>(
    () => ({
      labels: objectUtils
        .keys(genderCountsByCategory)
        .map((categoryCode) => getCategoryDisplayNameFromCode(categoryCode)),
      datasets: [
        {
          label: "Hommes",
          data: Object.values(genderCountsByCategory).map((counts) => counts[GENDER.M]),
          backgroundColor: GENDER_COLORS[GENDER.M],
        },
        {
          label: "Femmes",
          data: Object.values(genderCountsByCategory).map((counts) => counts[GENDER.F]),
          backgroundColor: GENDER_COLORS[GENDER.F],
        },
      ],
    }),
    [genderCountsByCategory, getCategoryDisplayNameFromCode],
  );

  const maxTotal = React.useMemo(
    () => Math.max(...Object.values(genderCountsByCategory).map((counts) => counts[GENDER.M] + counts[GENDER.F]), 0),
    [genderCountsByCategory],
  );

  const options = React.useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: {
            autoSkip: false,
            color: legendColor,
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          stacked: true,
          suggestedMax: Math.ceil(maxTotal * 1.1),
          ticks: {
            color: legendColor,
          },
          grid: {
            color: gridColor,
          },
        },
      },
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
          display: (context) => context.datasetIndex === 1, // Only show on top dataset (Femmes)
          anchor: "end",
          align: "end",
          color: legendColor,
          font: {
            weight: "bold",
          },
          formatter: (_value, context) => {
            const maleCount = context.chart.data.datasets[0].data[context.dataIndex] as number;
            const femaleCount = context.chart.data.datasets[1].data[context.dataIndex] as number;
            return maleCount + femaleCount;
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (context) => {
              const categoryCode = objectUtils.keys(genderCountsByCategory)[context[0].dataIndex];
              return getDisplayedCategoryCodeAndName(categoryCode).name;
            },
            label: () => "",
            afterBody: (context) => {
              const categoryCode = objectUtils.keys(genderCountsByCategory)[context[0].dataIndex];
              const counts = genderCountsByCategory[categoryCode];
              if (!counts) return "";

              const maleCount = counts[GENDER.M];
              const femaleCount = counts[GENDER.F];

              return [
                `${maleCount} homme${maleCount >= 2 ? "s" : ""}`,
                `${femaleCount} femme${femaleCount >= 2 ? "s" : ""}`,
                `Total : ${maleCount + femaleCount}`,
              ];
            },
          },
        },
      },
    }),
    [legendColor, gridColor, maxTotal, genderCountsByCategory, getDisplayedCategoryCodeAndName],
  );

  return (
    <div style={{ minHeight: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
