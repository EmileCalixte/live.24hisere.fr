import {useState} from "react";
import DurationInputs from "../../misc/DurationInputs";

const RankingSettingsTime = ({
    isVisible,
    currentRankingTime,
    onRankingTimeSave,
    maxRankingTime,
}) => {
    // The current value from the inputs in ms, saved or not
    const [time, setTime] = useState(currentRankingTime);

    const onSubmit = (e) => {
        e.preventDefault();
        setTime(time);
        onRankingTimeSave(time);
    }

    return (
        <form className="inline-input-group"
              style={{visibility: isVisible ? 'visible' : 'hidden'}}
              onSubmit={onSubmit}
        >
            <DurationInputs duration={time}
                            setDuration={setTime}
                            maxDuration={maxRankingTime}

            />
            <button className="button"
                    disabled={time === currentRankingTime}
                    style={{marginLeft: 10}}
            >
                OK
            </button>
        </form>
    );
}

export default RankingSettingsTime;
