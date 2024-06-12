import { type Runner } from "../../../types/Runner";
import { spaceship } from "../../../utils/compareUtils";
import { getRunnersSelectOptions } from "../../../utils/runnerUtils";
import React from "react";
import Select from "../../ui/forms/Select";

interface RunnerSelectorProps {
    runners: Runner[] | undefined;
    onSelectRunner: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedRunnerId: string | undefined;
}

export default function RunnerSelector({ runners, onSelectRunner, selectedRunnerId }: RunnerSelectorProps): React.ReactElement {
    const selectedRunnerExists = React.useMemo(() => {
        if (!runners) {
            return false;
        }

        if (selectedRunnerId === undefined) {
            return false;
        }

        const searchedRunnerId = parseInt(selectedRunnerId);

        const runner = runners.find(runner => {
            return runner.id === searchedRunnerId;
        });

        return runner !== undefined;
    }, [runners, selectedRunnerId]);

    const idSortedRunners = React.useMemo<Runner[] | false>(() => {
        if (!runners) {
            return false;
        }

        return [...runners].sort((a, b) => spaceship(a.id, b.id));
    }, [runners]);

    const nameSortedRunners = React.useMemo<Runner[] | false>(() => {
        if (!runners) {
            return false;
        }

        return [...runners].sort((a, b) => spaceship(
            a.lastname + a.firstname + a.id,
            b.lastname + b.firstname + b.id,
        ));
    }, [runners]);

    const selectOptions = [
        ...getRunnersSelectOptions(idSortedRunners),
        ...getRunnersSelectOptions(nameSortedRunners, runner => `${runner.lastname.toUpperCase()} ${runner.firstname} – N° ${runner.id}`),
    ];

    return (
        <div className="runner-details-runner-selector-container">
            <Select label="Coureur"
                    options={selectOptions}
                    isLoading={!idSortedRunners}
                    loadingOptionLabel="Chargement des coureurs"
                    placeholderLabel="Cliquez ici pour sélectionner un coureur"
                    value={selectedRunnerExists ? selectedRunnerId : undefined}
                    onChange={onSelectRunner}
            />
        </div>
    );
}
