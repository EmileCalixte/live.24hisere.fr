import React, { useEffect, useState } from "react";
import DurationInputs from "../../ui/forms/DurationInputs";

interface RankingSettingsTimeProps {
    isVisible: boolean;
    currentRankingTime: number;
    onRankingTimeSave: (time: number) => any;
    maxRankingTime: number;
}

export default function RankingSettingsTime({
    isVisible,
    currentRankingTime,
    onRankingTimeSave,
    maxRankingTime,
}: RankingSettingsTimeProps): React.ReactElement {
    // The current value from the inputs in ms, saved or not
    const [time, setTime] = useState(currentRankingTime);

    const onSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setTime(time);
        onRankingTimeSave(time);
    };

    // Reset inputs when ranking time in settings is changed, for example when selected race changes
    useEffect(() => {
        setTime(currentRankingTime);
    }, [currentRankingTime]);

    return (
        <form className="inline-input-group d-flex"
              style={{ visibility: isVisible ? "visible" : "hidden" }}
              onSubmit={onSubmit}
        >
            <DurationInputs duration={time}
                            setDuration={setTime}
                            maxDuration={maxRankingTime}

            />
            <button className="button"
                    disabled={time === currentRankingTime}
                    style={{ marginLeft: 10 }}
            >
                OK
            </button>
        </form>
    );
}
