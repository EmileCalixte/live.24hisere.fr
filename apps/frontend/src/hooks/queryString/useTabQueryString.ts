import React from "react";
import { arrayUtils } from "@live24hisere/utils";
import { SearchParam } from "../../constants/searchParams";
import { useQueryString } from "./useQueryString";

interface UseTabQueryString<T extends string> {
  selectedTab: T;
  setTabParam: (tab: T) => void;
}

export function useTabQueryString<T extends string>(
  availableTabs: T[],
  defaultTab: (typeof availableTabs)[number],
): UseTabQueryString<T> {
  const { searchParams, setParams } = useQueryString();

  const searchParamsTab = searchParams.get(SearchParam.TAB);

  const selectedTab = React.useMemo<T>(() => {
    if (!arrayUtils.inArray(searchParamsTab, availableTabs)) {
      return defaultTab;
    }

    return searchParamsTab;
  }, [availableTabs, defaultTab, searchParamsTab]);

  const setTabParam = React.useCallback(
    (tab: T) => {
      setParams({ [SearchParam.TAB]: tab });
    },
    [setParams],
  );

  React.useEffect(() => {
    if (!arrayUtils.inArray(searchParamsTab, availableTabs)) {
      setParams({ [SearchParam.TAB]: defaultTab }, { replace: true });
    }
  }, [availableTabs, defaultTab, searchParamsTab, setParams]);

  return {
    selectedTab,
    setTabParam,
  };
}
