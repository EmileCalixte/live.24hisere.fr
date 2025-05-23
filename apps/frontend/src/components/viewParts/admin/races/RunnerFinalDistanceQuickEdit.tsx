import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdminRunner, RaceRunner } from "@live24hisere/core/types";
import { Key } from "../../../../constants/keyboardEvent";
import { usePatchAdminRaceRunner } from "../../../../hooks/api/requests/admin/participants/usePatchAdminRaceRunner";
import CircularLoader from "../../../ui/CircularLoader";
import { Input } from "../../../ui/forms/Input";

interface RunnerFinalDistanceQuickEditProps {
  runner: RaceRunner<AdminRunner>;
}

export default function RunnerFinalDistanceQuickEdit({
  runner,
}: RunnerFinalDistanceQuickEditProps): React.ReactElement {
  const patchRunnerMutation = usePatchAdminRaceRunner(runner.raceId, runner.id);

  const [distance, setDistance] = React.useState(runner.finalDistance);
  const distanceBeforeEdit = React.useRef(runner.finalDistance);
  const hasDistanceBeenEdited = distance !== distanceBeforeEdit.current;

  function save(): void {
    if (!hasDistanceBeenEdited) {
      return;
    }

    patchRunnerMutation.mutate(
      {
        finalDistance: distance,
      },
      {
        onSuccess: () => {
          distanceBeforeEdit.current = distance;
        },
      },
    );
  }

  return (
    <div className="flex gap-2">
      <span className="flex items-center justify-center" style={{ width: "1em" }}>
        {patchRunnerMutation.isPending && <CircularLoader />}

        {patchRunnerMutation.isSuccess && <FontAwesomeIcon icon={faCheck} />}
      </span>

      <Input
        label="Distance après dernier passage (m)"
        labelTextClassName="sr-only"
        type="number"
        min={0}
        step={0.001}
        required
        name="initial-distance"
        value={distance}
        onChange={(e) => {
          setDistance(e.target.value);
        }}
        onBlur={save}
        onKeyUp={(e) => {
          if (e.key === Key.ENTER) {
            save();
          }
        }}
      />
    </div>
  );
}
