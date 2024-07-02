import React, { useCallback, useEffect, useMemo, useState } from "react";

export const MIN_DOTS = 0;
export const MAX_DOTS = 3;
export const UPDATE_DOT_COUNT_INTERVAL_TIME = 250;

interface OptionWithLoadingDotsProps {
    children: React.ReactNode;
}

/**
 * @deprecated Causes blinking when select is opened on mobile
 */
export default function OptionWithLoadingDots({ children }: OptionWithLoadingDotsProps): React.ReactElement {
    const [dotCount, setDotCount] = useState(MAX_DOTS);

    const updateDotCount = useCallback(() => {
        setDotCount(dotCount => dotCount >= MAX_DOTS ? MIN_DOTS : dotCount + 1);
    }, []);

    useEffect(() => {
        const dotsInterval = setInterval(() => { updateDotCount(); }, UPDATE_DOT_COUNT_INTERVAL_TIME);

        return () => { clearInterval(dotsInterval); };
    }, [updateDotCount]);

    const dots = useMemo<string>(() => {
        return new Array(dotCount).fill(".").join("");
    }, [dotCount]);

    return (
        <option disabled>
            {children}{dots}
        </option>
    );
}
