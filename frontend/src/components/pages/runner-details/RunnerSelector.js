import OptionWithLoadingDots from "../../misc/OptionWithLoadingDots";
import {useCallback, useEffect, useMemo, useState} from "react";

const RunnerSelector = ({runners, onSelectRunner, selectedRunnerId}) => {
    const [idSortedRunners, setIdSortedRunners] = useState(false);
    const [nameSortedRunners, setNameSortedRunners] = useState(false);

    const selectedRunnerExists = useMemo(() => {
        if (!runners) {
            return false;
        }

        const runner = runners.find(runner => {
            return runner.id === selectedRunnerId;
        })

        return runner !== undefined;
    }, [runners, selectedRunnerId]);

    const sortRunners = useCallback(() => {
        if (runners === false) {
            return;
        }

        setIdSortedRunners([...runners].sort((a, b) => {
            const aId = parseInt(a.id);
            const bId = parseInt(b.id);

            if (aId < bId) {
                return -1;
            }

            if (aId > bId) {
                return 1;
            }

            return 0;
        }));

        setNameSortedRunners([...runners].sort((a, b) => {
            const aIsTeam = a.isTeam === '1';
            const bIsTeam = b.isTeam === '1';
            const aName = a.lastname + a.firstname;
            const bName = b.lastname + b.firstname;

            if (aIsTeam && !bIsTeam) {
                return -1;
            }

            if (!aIsTeam && bIsTeam) {
                return 1;
            }

            return aName.localeCompare(bName);
        }));
    }, [runners]);

    useEffect(() => {
        sortRunners();
    }, [sortRunners]);

    return(
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
                            )
                        }

                        return (
                            <>
                                {idSortedRunners.map(runner => {
                                    return (
                                        <option key={runner.id} value={runner.id}>
                                            N° {runner.id} –  {runner.lastname} {runner.firstname}
                                        </option>
                                    )
                                })}

                                <option disabled />
                                <option disabled>—————</option>
                                <option disabled />

                                {nameSortedRunners.map(runner => {
                                    return (
                                        <option key={runner.id} value={runner.id}>
                                            {runner.lastname} {runner.firstname} – N° {runner.id}
                                        </option>
                                    )
                                })}
                            </>
                        );
                    })()}

                </select>
            </div>
        </div>
    )
}

export default RunnerSelector;
