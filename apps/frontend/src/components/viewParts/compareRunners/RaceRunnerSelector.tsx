import React, { type HTMLProps } from "react";
import type { PublicRunner, RaceDict, RaceWithEdition } from "@live24hisere/core/types";
import { arrayUtils } from "@live24hisere/utils";
import { useGetPublicRunnerParticipations } from "../../../hooks/api/requests/public/participants/useGetPublicRunnerParticipations";
import { useNameSortedRunners } from "../../../hooks/runners/useNameSortedRunners";
import { getRacesSelectOptions } from "../../../utils/raceUtils";
import { getRunnersSelectOptions } from "../../../utils/runnerUtils";
import Select from "../../ui/forms/Select";

type Selected = Map<number, number[]>;

interface RaceRunnerSelectorProps extends HTMLProps<HTMLDivElement> {
  races: RaceDict<RaceWithEdition> | undefined;
  runners: PublicRunner[] | undefined;
  alreadySelected: Selected;
}

export default function RaceRunnerSelector({
  races,
  runners,
  alreadySelected,
  ...props
}: RaceRunnerSelectorProps): React.ReactElement {
  const [selectedRunnerId, setSelectedRunnerId] = React.useState<number | undefined>(undefined);
  const [selectedRaceId, setSelectedRaceId] = React.useState<number | undefined>(undefined);

  const sortedRunners = useNameSortedRunners(runners);

  const runnerSelectOptions = getRunnersSelectOptions(
    sortedRunners,
    (runner) => `${runner.lastname.toUpperCase()} ${runner.firstname}`,
  );

  const selectedRunner = React.useMemo(
    () => runners?.find((r) => r.id === selectedRunnerId),
    [runners, selectedRunnerId],
  );

  const getRunnerParticipationsQuery = useGetPublicRunnerParticipations(selectedRunner?.id);
  const runnerParticipations = getRunnerParticipationsQuery.data?.participations;

  const runnerRaceIds = React.useMemo(() => runnerParticipations?.map(({ raceId }) => raceId), [runnerParticipations]);

  const selectableRaces = React.useMemo(() => {
    if (!selectedRunner || !races || !runnerRaceIds) {
      return undefined;
    }

    return Object.values(races).filter(
      (race) =>
        arrayUtils.inArray(race.id, runnerRaceIds)
        && !arrayUtils.inArray(race.id, alreadySelected.get(selectedRunner.id) ?? []),
    );
  }, [runnerRaceIds, selectedRunner, alreadySelected, races]);

  const raceSelectOptions = getRacesSelectOptions(selectableRaces, (race) => `${race.edition.name} – ${race.name}`);

  const onSelectRunner = React.useCallback<React.ChangeEventHandler<HTMLSelectElement>>((e) => {
    setSelectedRunnerId(parseInt(e.target.value));
  }, []);

  const onSelectRace = React.useCallback<React.ChangeEventHandler<HTMLSelectElement>>((e) => {
    setSelectedRaceId(parseInt(e.target.value));
  }, []);

  return (
    <div {...props}>
      <Select
        label="Coureur"
        options={runnerSelectOptions}
        isLoading={!sortedRunners}
        loadingOptionLabel="Chargement des coureurs"
        placeholderLabel="Cliquez ici pour sélectionner un coureur"
        value={selectedRunnerId}
        onChange={onSelectRunner}
      />

      <Select
        label="Course"
        options={raceSelectOptions}
        disabled={!selectedRunner}
        isLoading={!races || getRunnerParticipationsQuery.isLoading}
        loadingOptionLabel={selectedRunner ? "Chargement des courses" : undefined}
        placeholderLabel={selectedRunner ? "Cliquez ici pour sélectionner une course" : undefined}
        value={selectedRaceId}
        onChange={onSelectRace}
      />
    </div>
  );
}
