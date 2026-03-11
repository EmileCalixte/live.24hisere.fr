import React from "react";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { SPLIT_TIMES_MODE_OPTIONS } from "../../../../constants/forms";
import { SearchParam } from "../../../../constants/searchParams";
import { SPLIT_TIMES_MODES, SplitTimesMode } from "../../../../constants/splitTimesMode";
import { runnerDetailsViewContext } from "../../../../contexts/RunnerDetailsViewContext";
import { parseAsEnum } from "../../../../queryStringParsers/parseAsEnum";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Input } from "../../../ui/forms/Input";
import RadioGroup from "../../../ui/forms/RadioGroup";

export const DEFAULT_REGULAR_INTERVAL = 50000;

export function SplitTabContent(): React.ReactElement {
  const { selectedRankingRunner } = React.useContext(runnerDetailsViewContext);

  const [selectedSplitTimesMode, setSelectedSplitTimesMode] = useQueryState(
    SearchParam.SPLIT_TIMES_MODE,
    parseAsEnum(SPLIT_TIMES_MODES).withDefault(SplitTimesMode.REGULAR_INTERVAL),
  );

  const [selectedRegularInterval, setSelectedRegularInterval] = useQueryState(
    SearchParam.REGULAR_INTERVAL,
    parseAsInteger.withDefault(0),
  );

  const [selectedCustomIntervals, setSelectedCustomIntervals] = useQueryState(
    SearchParam.CUSTOM_INTERVALS,
    parseAsArrayOf(parseAsInteger).withDefault([]),
  );

  const selectedIntervals = React.useMemo<number[]>(() => {
    if (!selectedRankingRunner) {
      return [];
    }

    if (selectedSplitTimesMode === SplitTimesMode.REGULAR_INTERVAL) {
      if (selectedRegularInterval <= 0) {
        return [];
      }

      const intervals: number[] = [];
      let current = selectedRegularInterval;

      while (selectedRankingRunner.distanceToLastPassage > current) {
        intervals.push(current);
        current += selectedRegularInterval;
      }

      return intervals;
    }

    return selectedCustomIntervals;
  }, [selectedCustomIntervals, selectedRankingRunner, selectedRegularInterval, selectedSplitTimesMode]);

  function onSplitTimesModeSelect(splitTimesMode: SplitTimesMode): void {
    trackEvent(TrackedEvent.CHANGE_SPLIT_TIMES_MODE, { mode: splitTimesMode, runnerId: selectedRankingRunner?.id });

    void setSelectedSplitTimesMode(splitTimesMode);
  }

  function onRegularIntervalUpdate(inputValue: string): void {
    let value = parseFloat(inputValue);

    if (isNaN(value)) {
      value = selectedRegularInterval;
    }

    void setSelectedRegularInterval(Math.round(value * 1000));
  }

  // Clear URL params on component unmount or on selected race change
  React.useEffect(
    () => () => {
      void setSelectedSplitTimesMode(null);
      void setSelectedRegularInterval(null);
      void setSelectedCustomIntervals(null);
    },
    [setSelectedCustomIntervals, setSelectedRegularInterval, setSelectedSplitTimesMode],
  );

  React.useEffect(() => {
    if (selectedSplitTimesMode === SplitTimesMode.REGULAR_INTERVAL) {
      void setSelectedRegularInterval(DEFAULT_REGULAR_INTERVAL);
      void setSelectedCustomIntervals(null);
    } else {
      void setSelectedRegularInterval(null);
      void setSelectedCustomIntervals(null);
    }
  }, [selectedSplitTimesMode, setSelectedCustomIntervals, setSelectedRegularInterval]);

  if (!selectedRankingRunner) {
    return <></>;
  }

  if (selectedRankingRunner.passages.length < 1) {
    return <p>Ce coureur n'a parcouru aucune distance : aucun temps intermédiaire à afficher.</p>;
  }

  const regularIntervalTooHigh =
    selectedSplitTimesMode === SplitTimesMode.REGULAR_INTERVAL
    && selectedRegularInterval > selectedRankingRunner.distanceToLastPassage;

  return (
    <div className="gap-default flex flex-col">
      <RadioGroup
        legend="Temps intermédiaires à..."
        name="splitTimesMode"
        options={SPLIT_TIMES_MODE_OPTIONS}
        value={selectedSplitTimesMode}
        onSelectOption={(option) => {
          onSplitTimesModeSelect(option.value);
        }}
      />

      {selectedSplitTimesMode === SplitTimesMode.REGULAR_INTERVAL ? (
        <div className="flex items-center gap-2">
          <Input
            inline
            inputClassName="w-20"
            label="Tous les "
            labelTextClassName="mr-2"
            type="number"
            min={0}
            max={999.999}
            value={selectedRegularInterval / 1000}
            onBlur={(e) => {
              onRegularIntervalUpdate(e.target.value);
            }}
            onKeyDown={(e) => {
              onRegularIntervalUpdate(e.currentTarget.value);
            }}
          />
          km
        </div>
      ) : (
        <p>TODO input pour ajouter un intervalle</p>
      )}

      {regularIntervalTooHigh && (
        <p>
          Choisissez un intervalle inférieur à{" "}
          {formatFloatNumber(selectedRankingRunner.distanceToLastPassage / 1000, 3)} km
        </p>
      )}

      {selectedSplitTimesMode === SplitTimesMode.CUSTOM && selectedIntervals.length < 1 && (
        <p>Ajoutez au moins une distance intermédiaire pour commencer.</p>
      )}
    </div>
  );
}
