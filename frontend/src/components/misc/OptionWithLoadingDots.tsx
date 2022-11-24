import React, {useCallback, useEffect, useMemo, useState} from "react"

export const MIN_DOTS = 0;
export const MAX_DOTS = 3;
export const UPDATE_DOT_COUNT_INTERVAL_TIME = 250;

const OptionWithLoadingDots: React.FunctionComponent<{children: React.ReactNode}> = ({children}) => {
    const [dotCount, setDotCount] = useState(MAX_DOTS);

    const updateDotCount = useCallback(() => {
        setDotCount(dotCount => dotCount >= MAX_DOTS ? MIN_DOTS : dotCount + 1)
    }, []);

    useEffect(() => {
        const dotsInterval = setInterval(() => updateDotCount(), UPDATE_DOT_COUNT_INTERVAL_TIME);

        return (() => clearInterval(dotsInterval));
    }, [updateDotCount]);

    const dots = useMemo<string>(() => {
        const dots = [];

        for (let i = 0; i < dotCount; ++i) {
            dots.push('.');
        }

        return dots.join('');
    }, [dotCount]);

    return (
        <option disabled>
            {children}{dots}
        </option>
    );
}

export default OptionWithLoadingDots
