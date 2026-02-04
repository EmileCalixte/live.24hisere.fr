import type React from "react";
import { useEffect, useState } from "react";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Button } from "../../../ui/forms/Button";
import DurationInputs from "../../../ui/forms/DurationInputs";

interface RankingSettingsTimeProps {
  isVisible: boolean;
  currentRankingTime: number;
  onRankingTimeSave: (time: number) => void;
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

  const onSubmit: FormSubmitEventHandler = (e): void => {
    e.preventDefault();
    setTime(time);
    onRankingTimeSave(time);
  };

  // Reset inputs when ranking time in settings is changed, for example when selected race changes
  useEffect(() => {
    setTime(currentRankingTime);
  }, [currentRankingTime]);

  return (
    <form className="flex gap-3" style={{ visibility: isVisible ? "visible" : "hidden" }} onSubmit={onSubmit}>
      <DurationInputs duration={time} setDuration={setTime} maxDuration={maxRankingTime} />
      <Button disabled={time === currentRankingTime}>OK</Button>
    </form>
  );
}
