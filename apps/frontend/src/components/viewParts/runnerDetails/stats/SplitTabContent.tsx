import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";
import type { RunnerProcessedDistanceSlot } from "@live24hisere/core/types";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { SPLIT_TIMES_MODE_OPTIONS } from "../../../../constants/forms";
import { Key } from "../../../../constants/keyboardEvent";
import { SearchParam } from "../../../../constants/searchParams";
import { SPLIT_TIMES_MODES, SplitTimesMode } from "../../../../constants/splitTimesMode";
import { runnerDetailsViewContext } from "../../../../contexts/RunnerDetailsViewContext";
import { parseAsEnum } from "../../../../queryStringParsers/parseAsEnum";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { getProcessedDistanceSlotsFromPassages } from "../../../../utils/passageUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Button } from "../../../ui/forms/Button";
import { DebouncedInput } from "../../../ui/forms/DebouncedInput";
import { Input } from "../../../ui/forms/Input";
import RadioGroup from "../../../ui/forms/RadioGroup";
import { SplitTimesTable } from "./SplitTimesTable";

export const MIN_REGULAR_INTERVAL = 1000;
export const DEFAULT_REGULAR_INTERVAL = 50000;
export const MIN_CUSTOM_INTERVAL = 1000;
export const MIN_DISTANCE_BETWEEN_CUSTOM_INTERVALS = 1000;

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

  const [customIntervalInputValue, setCustomIntervalInputValue] = React.useState("");

  const customIntervalInputMeters = React.useMemo(() => {
    const value = parseFloat(customIntervalInputValue);
    return isNaN(value) || value <= 0 ? null : Math.round(value * 1000);
  }, [customIntervalInputValue]);

  const customIntervalTooClose = React.useMemo(() => {
    if (customIntervalInputMeters === null) {
      return false;
    }

    return selectedCustomIntervals.some(
      (existing) => Math.abs(existing - customIntervalInputMeters) < MIN_DISTANCE_BETWEEN_CUSTOM_INTERVALS,
    );
  }, [customIntervalInputMeters, selectedCustomIntervals]);

  const customIntervalTooLow = customIntervalInputMeters !== null && customIntervalInputMeters < MIN_CUSTOM_INTERVAL;

  const customIntervalTooHigh =
    customIntervalInputMeters !== null
    && selectedRankingRunner !== undefined
    && customIntervalInputMeters > selectedRankingRunner.distanceToLastPassage;

  function addCustomInterval(): void {
    if (customIntervalInputMeters === null || customIntervalTooLow || customIntervalTooClose || customIntervalTooHigh) {
      return;
    }

    void setSelectedCustomIntervals([...selectedCustomIntervals, customIntervalInputMeters].toSorted((a, b) => a - b));
    setCustomIntervalInputValue("");
  }

  function removeCustomInterval(meters: number): void {
    void setSelectedCustomIntervals(selectedCustomIntervals.filter((i) => i !== meters));
  }

  function onRegularIntervalChange(inputValue: string): void {
    let value = parseFloat(inputValue);

    if (isNaN(value)) {
      value = selectedRegularInterval / 1000;
    }

    void setSelectedRegularInterval(Math.round(value * 1000));
  }

  // Clean custom intervals if invalid values are provided in URL
  React.useEffect(() => {
    if (selectedCustomIntervals.length <= 0) {
      return;
    }

    if (selectedSplitTimesMode === SplitTimesMode.REGULAR_INTERVAL) {
      void setSelectedCustomIntervals([]);
    } else {
      const cleanedCustomIntervals = selectedCustomIntervals
        .filter(
          (interval) =>
            interval >= MIN_CUSTOM_INTERVAL && interval <= (selectedRankingRunner?.distanceToLastPassage ?? 0),
        )
        .toSorted((a, b) => a - b);

      if (cleanedCustomIntervals.join(",") !== selectedCustomIntervals.join(",")) {
        void setSelectedCustomIntervals(cleanedCustomIntervals);
      }
    }
  }, [
    selectedCustomIntervals,
    selectedCustomIntervals.length,
    selectedRankingRunner?.distanceToLastPassage,
    selectedSplitTimesMode,
    setSelectedCustomIntervals,
  ]);

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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              inline
              inputClassName="w-20"
              label="Ajouter un intervalle à"
              labelTextClassName="mr-2"
              type="number"
              min={0}
              step="any"
              value={customIntervalInputValue}
              onChange={(e) => {
                setCustomIntervalInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === Key.ENTER) {
                  addCustomInterval();
                }
              }}
            />
            km
            <Button
              size="sm"
              disabled={
                customIntervalInputMeters === null
                || customIntervalTooLow
                || customIntervalTooClose
                || customIntervalTooHigh
              }
              onClick={addCustomInterval}
              aria-label={
                customIntervalInputMeters !== null
                  ? `Ajouter l'intervalle ${formatFloatNumber(customIntervalInputMeters / 1000, 1, 3)} kilomètres`
                  : undefined
              }
            >
              Ajouter
            </Button>
          </div>

          {customIntervalTooLow && (
            <p role="alert">Choisissez un intervalle d'au moins {MIN_CUSTOM_INTERVAL / 1000} km.</p>
          )}

          {customIntervalTooHigh && (
            <p role="alert">
              Choisissez un intervalle inférieur à la distance du coureur (inférieur à{" "}
              {formatFloatNumber(selectedRankingRunner.distanceToLastPassage / 1000, 3)} km).
            </p>
          )}

          {customIntervalTooClose && (
            <p role="alert">
              Cet intervalle est trop proche d'un intervalle existant (écart minimum :{" "}
              {MIN_DISTANCE_BETWEEN_CUSTOM_INTERVALS / 1000} km).
            </p>
          )}
        </div>
      )}

      {regularIntervalTooHigh && (
        <p role="alert">
          Choisissez un intervalle inférieur à la distance du coureur (inférieur à{" "}
          {formatFloatNumber(selectedRankingRunner.distanceToLastPassage / 1000, 3)} km).
        </p>
      )}

      {regularIntervalTooLow && (
        <p role="alert">Choisissez un intervalle d'au moins {MIN_REGULAR_INTERVAL / 1000} km.</p>
      )}

      {selectedSplitTimesMode === SplitTimesMode.CUSTOM && selectedIntervals.length < 1 && (
        <p>Ajoutez au moins une distance intermédiaire pour afficher les sections correspondantes.</p>
      )}

      {distanceSlots.length > 0 && (
        <>
          {selectedCustomIntervals.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2 lg:-mb-2">
              {selectedCustomIntervals.map((meters) => (
                <li
                  key={meters}
                  className="flex items-center gap-1 rounded-sm border border-neutral-300 pl-2 dark:border-neutral-700"
                >
                  <span>{formatFloatNumber(meters / 1000, 1, 3)} km</span>

                  <Button
                    size="sm"
                    color="transparent"
                    onClick={() => {
                      removeCustomInterval(meters);
                    }}
                    aria-label={`Enlever l'intervalle ${formatFloatNumber(meters / 1000, 1, 3)} kilomètres`}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                </li>
              ))}
            </ul>
          )}

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
