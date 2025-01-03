import React from "react";
import type { ApiRequest, ApiRequestResultLegacy } from "@live24hisere/core/types";

export const DEFAULT_FETCH_INTERVAL = 20000;

interface UseIntervalApiRequest<T extends ApiRequest> {
  result: ApiRequestResultLegacy<T> | undefined;
  json: ApiRequestResultLegacy<T>["json"];
}

export function useIntervalSimpleApiRequest<TFunc extends ApiRequest>(
  fetchFunction: ((...args: []) => Promise<ApiRequestResultLegacy<TFunc>>) | undefined,
  fetchInterval = DEFAULT_FETCH_INTERVAL,
): UseIntervalApiRequest<TFunc> {
  const input = React.useMemo(() => {
    if (!fetchFunction) {
      return undefined;
    }

    return [fetchFunction] as const;
  }, [fetchFunction]);

  return useIntervalApiRequest(input, fetchInterval);
}

export function useIntervalApiRequest<TFunc extends ApiRequest, TArgs extends readonly any[]>(
  input: readonly [(...args: TArgs) => Promise<ApiRequestResultLegacy<TFunc>>, ...TArgs] | undefined,
  fetchInterval = DEFAULT_FETCH_INTERVAL,
): UseIntervalApiRequest<TFunc> {
  const [result, setResult] = React.useState<ApiRequestResultLegacy<TFunc> | undefined>(undefined);

  const performApiRequest = React.useCallback(async (): Promise<void> => {
    if (!input) {
      return;
    }

    const [fetchFunction, ...fetchFunctionArguments] = input;

    setResult(await fetchFunction(...fetchFunctionArguments));
  }, [input]);

  React.useEffect(() => {
    void performApiRequest();

    const interval = setInterval(() => {
      void performApiRequest();
    }, fetchInterval);

    return () => {
      clearInterval(interval);
    };
  }, [performApiRequest, fetchInterval]);

  return {
    result,
    json: result?.json,
  };
}
