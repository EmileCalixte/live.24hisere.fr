import React from "react";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "tailwind-variants";
import type { PublicRace, RaceRunnerWithProcessedPassages } from "@live24hisere/core/types";
import { appDataContext } from "../../../contexts/AppDataContext";
import { useRaceTime } from "../../../hooks/useRaceTime";
import type { MinimalRankingRunnerInput, RankingRunner } from "../../../types/Ranking";
import { formatMsAsDuration, formatMsDurationHms } from "../../../utils/durationUtils";
import { getPaceFromSpeed } from "../../../utils/mathUtils";
import { isRaceFinished, isRaceStarted } from "../../../utils/raceUtils";
import { formatFloatNumber } from "../../../utils/utils";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/forms/Button";
import { TimelineDot } from "../../ui/timeline/TimelineDot";
import { TimelineSegment } from "../../ui/timeline/TimelineSegment";

interface RunnerDetailsLapsProps {
  runner: RankingRunner<MinimalRankingRunnerInput & RaceRunnerWithProcessedPassages>;
  race: PublicRace;
  exportRunnerToXlsx: () => unknown;
}

interface LapTimelineDot {
  label: React.ReactNode;
  time: number;
}

function LapTimelineDot({ label, time }: LapTimelineDot): React.ReactElement {
  return (
    <TimelineDot>
      <span className="font-semibold">{label}</span>
      {" – "}
      <span>{formatMsAsDuration(time)}</span>
    </TimelineDot>
  );
}

interface TimelineSegmentProps extends Omit<React.ComponentProps<typeof TimelineSegment>, "children"> {
  passageDistance?: React.ReactNode;
  label?: React.ReactNode;
  speed?: number;
  lapBadge?: "fastest" | "slowest" | undefined;
  isLastElement?: boolean;
}

function LapTimelineSegment({
  passageDistance,
  label,
  speed,
  lapBadge,
  isLastElement = false,
  ...props
}: TimelineSegmentProps): React.ReactElement {
  const pace = speed !== undefined ? getPaceFromSpeed(speed) : 0;

  return (
    <TimelineSegment {...props}>
      <div
        className={cn("flex flex-col gap-4 text-sm", passageDistance === undefined && "pt-4", !isLastElement && "pb-4")}
      >
        {passageDistance !== undefined && (
          <div className="text-neutral-500 dark:text-neutral-400">{passageDistance}</div>
        )}
        {(label !== undefined || speed !== undefined) && (
          <div>
            {label !== undefined && <div>{label}</div>}
            {speed !== undefined && (
              <div className="text-neutral-500 dark:text-neutral-400">
                {formatFloatNumber(speed, 2)} km/h – {formatMsDurationHms(pace)} / km
                {lapBadge === "fastest" && (
                  <span className="ml-2 text-green-600 dark:text-green-400">(meilleur tour)</span>
                )}
                {lapBadge === "slowest" && (
                  <span className="ml-2 text-orange-500 dark:text-orange-400">(tour le + lent)</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </TimelineSegment>
  );
}

export default function RunnerDetailsLaps({
  runner,
  race,
  exportRunnerToXlsx,
}: RunnerDetailsLapsProps): React.ReactElement {
  const { serverTimeOffset } = React.useContext(appDataContext);

  const raceTime = useRaceTime(race, serverTimeOffset);

  const raceFinished = isRaceFinished(race, serverTimeOffset);
  const raceInProgress = isRaceStarted(race, serverTimeOffset) && !raceFinished;

  const passages = React.useMemo(
    () => [...runner.passages].sort((a, b) => a.processed.lapEndRaceTime - b.processed.lapEndRaceTime),
    [runner.passages],
  );

  const currentLapDuration = React.useMemo(() => {
    if (passages.length === 0) {
      return raceTime;
    }

    return raceTime - passages[passages.length - 1].processed.lapEndRaceTime;
  }, [raceTime, passages]);

  const finalDistance = runner.totalDistance - runner.distanceToLastPassage;

  const { fastestLapId, slowestLapId } = React.useMemo(() => {
    const regularLaps = passages.filter((p) => p.processed.lapNumber !== null);

    if (regularLaps.length === 0) {
      return { fastestLapId: null, slowestLapId: null };
    }

    const fastest = regularLaps.reduce((a, b) => (a.processed.lapSpeed > b.processed.lapSpeed ? a : b));
    const slowest = regularLaps.reduce((a, b) => (a.processed.lapSpeed < b.processed.lapSpeed ? a : b));

    return { fastestLapId: fastest.id, slowestLapId: slowest.id };
  }, [passages]);

  const lastPassageDistanceLabel = React.useMemo(() => {
    if (passages.length === 0) {
      return undefined;
    }

    const last = passages[passages.length - 1];

    return `${formatFloatNumber(last.processed.totalDistance / 1000, 2, 3)} km`;
  }, [passages]);

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="flex flex-col gap-3 sm:flex-row">
        <span>Détails des tours</span>

        <span>
          <Button
            size="sm"
            onClick={() => {
              exportRunnerToXlsx();
            }}
            icon={<FontAwesomeIcon icon={faFileExcel} />}
          >
            Télécharger au format Excel
          </Button>
        </span>
      </h3>

      <p>Distance du tour : {formatFloatNumber(Number(race.lapDistance), 0, 3)} m</p>

      <div>
        <LapTimelineDot label="Départ" time={0} />

        {passages.map((passage, index) => {
          const prevPassage = index > 0 ? passages[index - 1] : null;
          const passageDistance = prevPassage
            ? `${formatFloatNumber(prevPassage.processed.totalDistance / 1000, 2, 3)} km`
            : undefined;
          const lapBadge =
            passage.id === fastestLapId ? "fastest" : passage.id === slowestLapId ? "slowest" : undefined;

          return (
            <React.Fragment key={passage.id}>
              <LapTimelineSegment
                passageDistance={passageDistance}
                label={
                  passage.processed.lapNumber === null
                    ? `Distance initiale (${Math.round(passage.processed.lapDistance)} m) – ${formatMsDurationHms(passage.processed.lapDuration)}`
                    : `Tour n° ${passage.processed.lapNumber} – ${formatMsDurationHms(passage.processed.lapDuration)}`
                }
                speed={passage.processed.lapSpeed}
                lapBadge={lapBadge}
              />

              <LapTimelineDot label={`Passage n° ${index + 1}`} time={passage.processed.lapEndRaceTime} />
            </React.Fragment>
          );
        })}

        {raceInProgress && !runner.stopped && (
          <LapTimelineSegment
            passageDistance={lastPassageDistanceLabel}
            label={`Tour en cours (${formatMsDurationHms(currentLapDuration)})`}
            isLastElement
          />
        )}

        {raceFinished && finalDistance <= 0 && lastPassageDistanceLabel !== undefined && (
          <LapTimelineSegment passageDistance={lastPassageDistanceLabel} hideBorder isLastElement />
        )}

        {raceFinished && finalDistance > 0 && (
          <>
            <LapTimelineSegment
              passageDistance={lastPassageDistanceLabel}
              label={`Distance finale (${Math.round(finalDistance)} m)${runner.finalDistanceDuration !== null ? ` – ${formatMsDurationHms(runner.finalDistanceDuration)}` : ""}`}
              {...(runner.finalDistanceSpeed !== null
                && runner.finalDistancePace !== null && {
                  speed: runner.finalDistanceSpeed,
                })}
            />

            <LapTimelineDot label="Fin" time={race.duration * 1000} />

            <LapTimelineSegment
              passageDistance={`${formatFloatNumber(runner.totalDistance / 1000, 3)} km`}
              hideBorder
              isLastElement
            />
          </>
        )}
      </div>
    </Card>
  );
}
