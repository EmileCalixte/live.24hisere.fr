import React from "react";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";
import type { RunnerProcessedDistanceSlot } from "@live24hisere/core/types";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { SPLIT_TIMES_MODE_OPTIONS } from "../../../../constants/forms";
import { SearchParam } from "../../../../constants/searchParams";
import { SPLIT_TIMES_MODES, SplitTimesMode } from "../../../../constants/splitTimesMode";
import { runnerDetailsViewContext } from "../../../../contexts/RunnerDetailsViewContext";
import { parseAsEnum } from "../../../../queryStringParsers/parseAsEnum";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { getProcessedDistanceSlotsFromPassages } from "../../../../utils/passageUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { DebouncedInput } from "../../../ui/forms/DebouncedInput";
import RadioGroup from "../../../ui/forms/RadioGroup";
import { SplitTimesTable } from "./SplitTimesTable";

export const MIN_REGULAR_INTERVAL = 1000;
export const DEFAULT_REGULAR_INTERVAL = 50000;

export function SplitTabContent(): React.ReactElement {
  const { selectedRankingRunner, selectedRace } = React.useContext(runnerDetailsViewContext);

  const [selectedSplitTimesMode, setSelectedSplitTimesMode] = useQueryState(
    SearchParam.SPLIT_TIMES_MODE,
    parseAsEnum(SPLIT_TIMES_MODES).withDefault(SplitTimesMode.REGULAR_INTERVAL),
  );

  const [selectedRegularInterval, setSelectedRegularInterval] = useQueryState(
    SearchParam.REGULAR_INTERVAL,
    parseAsInteger.withDefault(DEFAULT_REGULAR_INTERVAL),
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
      if (selectedRegularInterval < MIN_REGULAR_INTERVAL) {
        return [];
      }

      const intervals: number[] = [];
      let current = selectedRegularInterval;

      while (selectedRankingRunner.distanceToLastPassage >= current) {
        intervals.push(current);
        current += selectedRegularInterval;
      }

      return intervals;
    }

    return selectedCustomIntervals;
  }, [selectedCustomIntervals, selectedRankingRunner, selectedRegularInterval, selectedSplitTimesMode]);

  const distanceSlots = React.useMemo<RunnerProcessedDistanceSlot[]>(() => {
    if (!selectedRankingRunner || !selectedRace || selectedIntervals.length === 0) {
      return [];
    }

    return getProcessedDistanceSlotsFromPassages(
      selectedRace,
      selectedRankingRunner.passages,
      selectedIntervals,
      selectedRankingRunner.distanceToLastPassage,
    );
  }, [selectedIntervals, selectedRankingRunner, selectedRace]);

  function onSplitTimesModeSelect(splitTimesMode: SplitTimesMode): void {
    trackEvent(TrackedEvent.CHANGE_SPLIT_TIMES_MODE, { mode: splitTimesMode, runnerId: selectedRankingRunner?.id });

    if (splitTimesMode === SplitTimesMode.REGULAR_INTERVAL) {
      void setSelectedCustomIntervals(null);
    }

    if (splitTimesMode === SplitTimesMode.CUSTOM) {
      void setSelectedRegularInterval(null);
    }

    void setSelectedSplitTimesMode(splitTimesMode);
  }

  function onRegularIntervalChange(inputValue: string): void {
    let value = parseFloat(inputValue);

    if (isNaN(value)) {
      value = selectedRegularInterval / 1000;
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

  if (!selectedRankingRunner) {
    return <></>;
  }

  if (selectedRankingRunner.passages.length < 1) {
    return <p>Ce coureur n'a parcouru aucune distance : aucun temps intermédiaire à afficher.</p>;
  }

  const regularIntervalTooHigh =
    selectedSplitTimesMode === SplitTimesMode.REGULAR_INTERVAL
    && selectedRegularInterval > selectedRankingRunner.distanceToLastPassage;

  const regularIntervalTooLow =
    selectedSplitTimesMode === SplitTimesMode.REGULAR_INTERVAL && selectedRegularInterval < MIN_REGULAR_INTERVAL;

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
          <DebouncedInput
            inline
            inputClassName="w-20"
            label="Tous les "
            labelTextClassName="mr-2"
            type="number"
            min={1}
            max={999.999}
            value={selectedRegularInterval / 1000}
            onChange={onRegularIntervalChange}
          />
          km
        </div>
      ) : (
        <p>TODO input pour ajouter un intervalle</p>
      )}

      {regularIntervalTooHigh && (
        <p>
          Choisissez un intervalle inférieur à la distance du coureur (inférieur à{" "}
          {formatFloatNumber(selectedRankingRunner.distanceToLastPassage / 1000, 3)} km).
        </p>
      )}

      {regularIntervalTooLow && <p>Choisissez un intervalle d'au moins {MIN_REGULAR_INTERVAL / 1000} km.</p>}

      {selectedSplitTimesMode === SplitTimesMode.CUSTOM && selectedIntervals.length < 1 && (
        <p>Ajoutez au moins une distance intermédiaire pour commencer.</p>
      )}

      {distanceSlots.length > 0 && (
        <>
          <SplitTimesTable slots={distanceSlots} />

          {distanceSlots.some((slot) => !slot.startRaceTimeExact || !slot.endRaceTimeExact) && (
            <p className="text-sm">
              Les temps précédés du symbole <q>≈</q> sont des estimations calculées par rapport aux temps des passages
              les plus proches au point de chronométrage.
            </p>
          )}
        </>
      )}
    </div>
  );
}
