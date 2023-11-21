import React from "react";
import { type ApiRequest, type ApiRequestResult } from "../types/api/ApiRequest";

export const DEFAULT_FETCH_INTERVAL = 20000;

interface UseIntervalApiRequestReturn<T extends ApiRequest> {
    result: ApiRequestResult<T> | undefined;
    json: ApiRequestResult<T>["json"];
}

export function useIntervalApiRequest<T extends ApiRequest>(
    fetchFunction: () => Promise<ApiRequestResult<T>>,
    fetchInterval = DEFAULT_FETCH_INTERVAL,
): UseIntervalApiRequestReturn<T> {
    const [result, setResult] = React.useState<ApiRequestResult<T> | undefined>(undefined);

    const performApiRequest = React.useCallback(async (): Promise<void> => {
        setResult(await fetchFunction());
    }, [fetchFunction]);

    React.useEffect(() => {
        void performApiRequest();

        const interval = setInterval(() => { void performApiRequest(); }, fetchInterval);

        return () => { clearInterval(interval); };
    }, [performApiRequest, fetchInterval]);

    return {
        result,
        json: result?.json,
    };
}
