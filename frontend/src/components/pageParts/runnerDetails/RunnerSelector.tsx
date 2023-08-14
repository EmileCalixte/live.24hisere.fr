import { type Runner } from "../../../types/Runner";
import OptionWithLoadingDots from "../../ui/forms/OptionWithLoadingDots";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface RunnerSelectorProps {
    runners: Runner[] | false;
    onSelectRunner: (e: React.ChangeEvent<HTMLSelectElement>) => any;
    selectedRunnerId: string | undefined;
}

export default function RunnerSelector({ runners, onSelectRunner, selectedRunnerId }: RunnerSelectorProps): JSX.Element {
    const [idSortedRunners, setIdSortedRunners] = useState<Runner[] | false>(false);
    const [nameSortedRunners, setNameSortedRunners] = useState<Runner[] | false>(false);

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

        setNameSortedRunners([...runners].sort((a, b) => {
            const aName = a.lastname + a.firstname;
            const bName = b.lastname + b.firstname;

            return aName.localeCompare(bName);
        }));
    }, [runners]);

    useEffect(() => {
        sortRunners();
    }, [sortRunners]);

    return (
        <div className="runner-details-runner-selector-container">
            <div className="input-group">
                <label htmlFor="runner-select">
                    Coureur
                </label>
                <select id="runner-select"
                        className="input-select"
                        value={selectedRunnerExists ? selectedRunnerId : "_placeholder"}
                        onChange={onSelectRunner}
                >
                    <option disabled hidden value="_placeholder">Sélectionnez un coureur</option>

                    {(() => {
                        if (idSortedRunners === false || nameSortedRunners === false) {
                            return (
                                <OptionWithLoadingDots>
                                    Chargement des coureurs
                                </OptionWithLoadingDots>
                            );
                        }

                        return (
                            <>
                                {idSortedRunners.map(runner => {
                                    return (
                                        <option key={runner.id} value={runner.id}>
                                            N° {runner.id} –  {runner.lastname} {runner.firstname}
                                        </option>
                                    );
                                })}

                                <option disabled />
                                <option disabled>—————</option>
                                <option disabled />

                                {nameSortedRunners.map(runner => {
                                    return (
                                        <option key={runner.id} value={runner.id}>
                                            {runner.lastname} {runner.firstname} – N° {runner.id}
                                        </option>
                                    );
                                })}
                            </>
                        );
                    })()}
                </select>
            </div>
        </div>
    );
}
