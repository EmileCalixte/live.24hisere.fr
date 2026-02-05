import React from "react";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useGetCategoryDisplayNameFromCode(categories: Record<string, string>) {
  return React.useCallback(
    (categoryCode: string) => {
      const displayedCategoryCode = categoryCode === "custom" ? "Autres" : categoryCode;
      return categories[categoryCode] ?? displayedCategoryCode;
    },
    [categories],
  );
}
