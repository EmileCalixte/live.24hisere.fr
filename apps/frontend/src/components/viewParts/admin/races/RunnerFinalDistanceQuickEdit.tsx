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

  const [distance, setDistance] = React.useState(runner.distanceAfterLastPassage);
  const distanceBeforeEdit = React.useRef(runner.distanceAfterLastPassage);
  const hasDistanceBeenEdited = distance !== distanceBeforeEdit.current;

  function save(): void {
    if (!hasDistanceBeenEdited) {
      return;
    }

    patchRunnerMutation.mutate(
      {
        distanceAfterLastPassage: distance,
      },
      {
        onSuccess: () => {
          distanceBeforeEdit.current = distance;
        },
      },
    );
  }

  return (
    <div className="d-flex gap-2">
      <span className="d-flex align-items-center justify-content-center" style={{ width: "1em" }}>
        {patchRunnerMutation.isPending && <CircularLoader />}

        {patchRunnerMutation.isSuccess && <FontAwesomeIcon icon={faCheck} />}
      </span>

      <Input
        label="Distance après dernier passage (m)"
        labelClassName="d-none"
        className=""
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
