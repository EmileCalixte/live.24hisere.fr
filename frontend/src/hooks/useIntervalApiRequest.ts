import React from "react";
import { type ApiRequest, type ApiRequestResult } from "../types/api/ApiRequest";

export const DEFAULT_FETCH_INTERVAL = 20000;

interface UseIntervalApiRequest<T extends ApiRequest> {
    result: ApiRequestResult<T> | undefined;
    json: ApiRequestResult<T>["json"];
}

export function useIntervalApiRequest<T extends ApiRequest>(
    fetchFunction: (() => Promise<ApiRequestResult<T>>) | undefined,
    fetchInterval = DEFAULT_FETCH_INTERVAL,
): UseIntervalApiRequest<T> {
    const [result, setResult] = React.useState<ApiRequestResult<T> | undefined>(undefined);

    const performApiRequest = React.useCallback(async (): Promise<void> => {
        if (!fetchFunction) {
            return;
        }

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
