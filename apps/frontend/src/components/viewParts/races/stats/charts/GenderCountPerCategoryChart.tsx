import React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import ReactDOMServer from "react-dom/server";
import { GENDER } from "@live24hisere/core/constants";
import { objectUtils } from "@live24hisere/utils";
import { GENDER_COLORS } from "../../../../../constants/chart";
import { Theme } from "../../../../../constants/theme";
import { appContext } from "../../../../../contexts/AppContext";
import { useChartTheme } from "../../../../../hooks/useChartTheme";
import CanvasjsReact from "../../../../../lib/canvasjs/canvasjs.react";

export type CategoryGenderDistribution = Partial<
  Record<CategoryCode | "custom", { [GENDER.M]: number; [GENDER.F]: number }>
>;

interface GenderCountPerCategoryChartProps {
  genderCountsByCategory: CategoryGenderDistribution;
  categories: Record<string, string>;
}

const CanvasJSChart = CanvasjsReact.CanvasJSChart;

export function GenderCountPerCategoryChart({
  genderCountsByCategory,
  categories,
}: GenderCountPerCategoryChartProps): React.ReactElement {
  const { theme } = React.useContext(appContext).theme;
  const chartTheme = useChartTheme();

  const getDisplayedCategoryCodeAndName = React.useCallback(
    (categoryCode: CategoryCode | "custom") => {
      const code = categoryCode === "custom" ? "Autres" : categoryCode;
      const name = categories[categoryCode] ?? code;

      return { code, name };
    },
    [categories],
  );

  const getTooltipContent = React.useCallback(
    (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const { categoryCode } = e.entries[0].dataPoint as { categoryCode: CategoryCode | "custom" };
      const counts = genderCountsByCategory[categoryCode];

      if (!counts) {
        return "";
      }

      const maleCount = counts[GENDER.M];
      const femaleCount = counts[GENDER.F];

      return ReactDOMServer.renderToString(
        <div>
          <div style={{ marginBottom: "0.75em" }}>
            <strong>{getDisplayedCategoryCodeAndName(categoryCode).name}</strong>
          </div>

          <div>
            {maleCount} homme{maleCount >= 2 ? "s" : ""}
          </div>

          <div>
            {femaleCount} femme{femaleCount >= 2 ? "s" : ""}
          </div>

          <div>Total : {maleCount + femaleCount}</div>
        </div>,
      );
    },
    [genderCountsByCategory, getDisplayedCategoryCodeAndName],
  );

  const options = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      theme: chartTheme,
      toolTip: {
        enabled: true,
        contentFormatter: getTooltipContent,
      },
      axisX: {
        interval: 1, // Force display all column labels even if width is reduced
      },
      data: [
        {
          type: "stackedColumn",
          showInLegend: true,
          name: "Hommes",
          color: GENDER_COLORS[GENDER.M],
          dataPoints: objectUtils.entries(genderCountsByCategory).map(([categoryCode, counts]) => ({
            y: counts[GENDER.M],
            label: getDisplayedCategoryCodeAndName(categoryCode).code,
            categoryCode,
          })),
        },
        {
          type: "stackedColumn",
          showInLegend: true,
          name: "Femmes",
          color: GENDER_COLORS[GENDER.F],
          indexLabel: "#total",
          indexLabelPlacement: "top",
          indexLabelFontColor: theme === Theme.DARK ? "#eee" : "#222",
          dataPoints: objectUtils.entries(genderCountsByCategory).map(([categoryCode, counts]) => ({
            y: counts[GENDER.F],
            label: getDisplayedCategoryCodeAndName(categoryCode).code,
            categoryCode,
          })),
        },
      ],
    }),
    [chartTheme, genderCountsByCategory, getDisplayedCategoryCodeAndName, getTooltipContent, theme],
  );

  return <CanvasJSChart options={options} />;
}
