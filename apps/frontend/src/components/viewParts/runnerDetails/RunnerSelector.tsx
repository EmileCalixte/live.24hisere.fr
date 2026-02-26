import type React from "react";
import type { PublicRunner } from "@live24hisere/core/types";
import { useNameSortedRunners } from "../../../hooks/runners/useNameSortedRunners";
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
  const sortedRunners = useNameSortedRunners(runners);

  const selectOptions = getRunnersSelectOptions(
    sortedRunners,
    (runner) => `${runner.lastname.toUpperCase()} ${runner.firstname}`,
  );

  return (
    <Select
      label="Coureur"
      options={selectOptions}
      isLoading={!sortedRunners}
      loadingOptionLabel="Chargement des coureurs"
      placeholderLabel="Cliquez ici pour sélectionner un coureur"
      value={selectedRunnerId}
      onChange={onSelectRunner}
    />
  );
}
