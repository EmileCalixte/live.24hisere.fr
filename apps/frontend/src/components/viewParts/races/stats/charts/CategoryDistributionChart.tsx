import React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import { numberUtils, objectUtils } from "@live24hisere/utils";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

const CATEGORY_COLORS: Record<string, string> = {
  ES: "#df7970",
  SE: "#d6975a",
  M0: "#d6d55a",
  M1: "#9ad65a",
  V1: "#9ad65a",
  M2: "#5dd65a",
  M3: "#5ad695",
  V2: "#5ad695",
  M4: "#5ad6d2",
  M5: "#5a76d6",
  V3: "#5a76d6",
  M6: "#6c5ad6",
  M7: "#9a5ad6",
  V4: "#9a5ad6",
  M8: "#d65ab6",
  M9: "#d65a88",
  V5: "#d65a88",
  M10: "#d65a5a",
  custom: "#aaccaa",
} as const;

export type CategoryDistribution = Partial<Record<CategoryCode | "custom", number>>;

interface CategoryDistributionChartProps {
  countsByCategory: CategoryDistribution;
  categories: Record<string, string>;
}

export function CategoryDistributionChart({
  countsByCategory,
  categories,
}: CategoryDistributionChartProps): React.ReactElement {
  const chartTheme = useChartTheme();

  const totalCount = Object.values(countsByCategory).reduce((totalCount, count) => totalCount + count);

  const options = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      theme: chartTheme,
      data: [
        {
          //   type: "pie",
          type: "doughnut",
          explodeOnClick: false,
          showInLegend: true,
          indexLabelPlacement: "inside",
          indexLabelFontColor: "white",
          dataPoints: objectUtils.entries(countsByCategory).map(([categoryCode, count]) => {
            const displayedCategoryCode = categoryCode === "custom" ? "Autres" : categoryCode;
            const categoryName = categories[categoryCode] ?? displayedCategoryCode;

            return {
              y: count,
              legendText: `${categoryName} (${count})`,
              indexLabel: `${count} ${displayedCategoryCode}`,
              toolTipContent: `${count} ${categoryName} (${numberUtils.formatPercentage(count / totalCount)})`,
              color: CATEGORY_COLORS[categoryCode],
            };
          }),
        },
      ],
    }),
    [categories, countsByCategory, chartTheme, totalCount],
  );

  return <CanvasJSChart options={options} />;
}
