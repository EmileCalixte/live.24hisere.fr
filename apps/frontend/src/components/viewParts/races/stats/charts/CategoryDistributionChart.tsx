import React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import { numberUtils, objectUtils } from "@live24hisere/utils";
import { CATEGORY_COLORS } from "../../../../../constants/chart";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

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
