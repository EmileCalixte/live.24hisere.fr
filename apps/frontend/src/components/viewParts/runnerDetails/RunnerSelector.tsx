import React from "react";
import type { PublicRunner } from "@live24hisere/core/types";
import { compareUtils } from "@live24hisere/utils";
import { getRunnersSelectOptions } from "../../../utils/runnerUtils";
import Select from "../../ui/forms/Select";

interface RunnerSelectorProps {
  runners: PublicRunner[] | undefined;
  onSelectRunner: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedRunnerId: string | undefined;
}

export default function RunnerSelector({
  runners,
  onSelectRunner,
  selectedRunnerId,
}: RunnerSelectorProps): React.ReactElement {
  const sortedRunners = React.useMemo<PublicRunner[] | false>(() => {
    if (!runners) {
      return false;
    }

    return [...runners].sort((a, b) => compareUtils.spaceship(a.lastname + a.firstname, b.lastname + b.firstname));
  }, [runners]);

  const selectOptions = getRunnersSelectOptions(
    sortedRunners,
    (runner) => `${runner.lastname.toUpperCase()} ${runner.firstname}`,
  );

  return (
    <div className="runner-details-runner-selector-container">
      <Select
        label="Coureur"
        options={selectOptions}
        isLoading={!sortedRunners}
        loadingOptionLabel="Chargement des coureurs"
        placeholderLabel="Cliquez ici pour sélectionner un coureur"
        value={selectedRunnerId}
        onChange={onSelectRunner}
      />
    </div>
  );
}
