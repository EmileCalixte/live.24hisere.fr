import React from "react";
import { type ApiRequest, type ApiRequestResult } from "../types/api/ApiRequest";

export const DEFAULT_FETCH_INTERVAL = 20000;

export function useIntervalApiRequest<T extends ApiRequest>(
    fetchFunction: () => Promise<ApiRequestResult<T>>,
    fetchInterval = DEFAULT_FETCH_INTERVAL,
): ApiRequestResult<T> | false {
    const [result, setResult] = React.useState<ApiRequestResult<T> | false>(false);

    const performApiRequest = React.useCallback(async (): Promise<void> => {
        setResult(await fetchFunction());
    }, [fetchFunction]);

    React.useEffect(() => {
        void performApiRequest();

        const interval = setInterval(() => { void performApiRequest(); }, fetchInterval);

        return () => { clearInterval(interval); };
    }, [performApiRequest, fetchInterval]);

    return result;
}
