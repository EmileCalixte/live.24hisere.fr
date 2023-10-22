import { type Runner } from "../../../types/Runner";
import { getRunnersSelectOptions } from "../../../utils/runnerUtils";
import CustomSelect from "../../ui/forms/CustomSelect";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface RunnerSelectorProps {
    runners: Runner[] | false;
    onSelectRunner: (e: React.ChangeEvent<HTMLSelectElement>) => any;
    selectedRunnerId: string | undefined;
}

export default function RunnerSelector({ runners, onSelectRunner, selectedRunnerId }: RunnerSelectorProps): React.ReactElement {
    const [idSortedRunners, setIdSortedRunners] = useState<Runner[] | false>(false);

    const selectedRunnerExists = useMemo(() => {
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

    const sortRunners = useCallback(() => {
        if (runners === false) {
            return;
        }

        setIdSortedRunners([...runners].sort((a, b) => {
            if (a.id < b.id) {
                return -1;
            }

            if (a.id > b.id) {
                return 1;
            }

            return 0;
        }));
    }, [runners]);

    useEffect(() => {
        sortRunners();
    }, [sortRunners]);

    return (
        <div className="runner-details-runner-selector-container">
            <CustomSelect
                label="Coureur"
                searchable
                searchInputLabelAndPlaceHolder="Rechercher par nom, prénom ou dossard"
                options={getRunnersSelectOptions(idSortedRunners)}
                isLoading={!idSortedRunners}
                loadingOptionLabel="Chargement des coureurs"
                placeholderLabel="Cliquez ici pour sélectionner un coureur"
                value={selectedRunnerExists ? selectedRunnerId : undefined}
                onChange={onSelectRunner}
            />
        </div>
    );
}
